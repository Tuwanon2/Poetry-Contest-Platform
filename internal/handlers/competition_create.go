package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"productproject/internal/klon"
)

// CreateCompetitionWithFormData handles competition creation with multipart form data (including poster upload)
func (h *KlonHandlers) CreateCompetitionWithFormData(c *gin.Context) {
	// Parse form data
	name := c.PostForm("name")
	orgIDStr := c.PostForm("organization_id")
	regStart := c.PostForm("registration_start")
	regEnd := c.PostForm("registration_end")
	description := c.PostForm("description")
	objective := c.PostForm("objective")
	levelsJSON := c.PostForm("levels_json")
	judgesJSON := c.PostForm("judges_json")

	if name == "" || orgIDStr == "" || regStart == "" || regEnd == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	orgID, err := strconv.Atoi(orgIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization_id"})
		return
	}

	       // Handle poster upload or poster_url
	       var posterPath string
	       file, err := c.FormFile("poster")
	       if err == nil {
		       // Generate unique filename using hash + timestamp
		       ext := filepath.Ext(file.Filename)
		       now := time.Now()
		       hash := sha256.New()
		       hash.Write([]byte(file.Filename + now.String()))
		       hashStr := hex.EncodeToString(hash.Sum(nil))[:12]
		       filename := fmt.Sprintf("poster_%s_%d%s", hashStr, now.Unix(), ext)
		       // Create directory structure
		       uploadDir := filepath.Join("uploads", "posters", fmt.Sprintf("%d", now.Year()), fmt.Sprintf("%02d", now.Month()))
		       if err := os.MkdirAll(uploadDir, 0755); err != nil {
			       c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
			       return
		       }
		       fullPath := filepath.Join(uploadDir, filename)
		       if err := c.SaveUploadedFile(file, fullPath); err != nil {
			       c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save poster"})
			       return
		       }
		       // Store as relative path
		       posterPath = fmt.Sprintf("/uploads/posters/%d/%02d/%s", now.Year(), now.Month(), filename)
	       } else {
		       // ถ้าไม่มีไฟล์แนบ ให้ลองอ่านจาก form (url string)
		       posterPath = c.PostForm("poster_url")
	       }

	// Parse levels
	var levels []struct {
		LevelName        string                   `json:"level_name"`
		PoemTypes        []string                 `json:"poem_types"`
		TopicMode        string                   `json:"topic_mode"`
		TopicName        string                   `json:"topic_name"`
		Description      string                   `json:"description"`
		ScoringCriteria  []map[string]interface{} `json:"scoring_criteria"`
		TotalScore       int                      `json:"total_score"`
	}

	if levelsJSON != "" {
		if err := json.Unmarshal([]byte(levelsJSON), &levels); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid levels_json format: " + err.Error()})
			return
		}
	}

	// Create competition
	comp := klon.Competition{
		Title:             name,
		OrganizationID:    orgID,
		RegistrationStart: regStart,
		RegistrationEnd:   regEnd,
		Description:       description,
		Purpose:           objective,
		PosterURL:         posterPath,
		Status:            "draft",
	}

	created, err := h.db.CreateCompetition(c.Request.Context(), comp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create competition: " + err.Error()})
		return
	}

	// Create levels in competition_levels table
	for _, level := range levels {
		scoringCriteriaJSON, _ := json.Marshal(level.ScoringCriteria)
		
		// Get level_id from levels table by name
		var levelID int
		err := h.db.GetDB().QueryRowContext(c.Request.Context(), 
			`SELECT level_id FROM levels WHERE name = $1`, level.LevelName).Scan(&levelID)
		
		if err != nil {
			fmt.Printf("Level '%s' not found in levels table: %v\n", level.LevelName, err)
			continue
		}
		
		// Handle multiple poem types - create one row per poem type
		if len(level.PoemTypes) == 0 {
			// No poem types specified, create level without poem_type
			_, err = h.db.GetDB().ExecContext(c.Request.Context(), `
				INSERT INTO competition_levels 
				(competition_id, level_id, rules, prizes, topic_enabled, topic_name, scoring_criteria)
				VALUES ($1, $2, $3, $4, $5, $6, $7)`,
				created.ID,
				levelID,
				level.Description,
				nil,
				level.TopicMode == "fixed",
				level.TopicName,
				scoringCriteriaJSON,
			)
			if err != nil {
				fmt.Printf("Failed to create level '%s': %v\n", level.LevelName, err)
			}
		} else {
			// Create a row for each poem type
			for _, poemTypeName := range level.PoemTypes {
				var poemTypeID int
				err := h.db.GetDB().QueryRowContext(c.Request.Context(),
					`SELECT poem_type_id FROM poem_types WHERE name = $1`, poemTypeName).Scan(&poemTypeID)
				
				if err != nil {
					fmt.Printf("Poem type '%s' not found: %v\n", poemTypeName, err)
					continue
				}
				
				_, err = h.db.GetDB().ExecContext(c.Request.Context(), `
					INSERT INTO competition_levels 
					(competition_id, level_id, poem_type_id, rules, prizes, topic_enabled, topic_name, scoring_criteria)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
					created.ID,
					levelID,
					poemTypeID,
					level.Description,
					nil,
					level.TopicMode == "fixed",
					level.TopicName,
					scoringCriteriaJSON,
				)
				
				if err != nil {
					fmt.Printf("Failed to create level '%s' with poem type '%s': %v\n", level.LevelName, poemTypeName, err)
				}
			}
		}
	}

	// Parse and invite judges if provided
	if judgesJSON != "" {
		var judges []struct {
			UserID   int      `json:"user_id"`
			Email    string   `json:"email"`
			FullName string   `json:"full_name"`
			Levels   []string `json:"levels"`
		}
		
		if err := json.Unmarshal([]byte(judgesJSON), &judges); err == nil {
			for _, judgeData := range judges {
				userID := judgeData.UserID
				
				// Create judge record for each level
				for _, levelName := range judgeData.Levels {
					// Get level_id by name
					var levelID int
					err := h.db.GetDB().QueryRowContext(c.Request.Context(),
						`SELECT level_id FROM levels WHERE name = $1`, levelName).Scan(&levelID)
					
					if err != nil {
						fmt.Printf("Failed to find level '%s' for judge: %v\n", levelName, err)
						continue
					}
					
					// Create judge
					judge := klon.Judge{
						UserID:        userID,
						CompetitionID: created.ID,
						LevelID:       levelID,
						Status:        "pending",
						InvitedBy:     1, // TODO: get from auth context
					}
					
					_, err = h.db.CreateJudge(c.Request.Context(), judge)
					if err != nil {
						fmt.Printf("Failed to invite judge %s for level %s: %v\n", judgeData.Email, levelName, err)
					}
				}
			}
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Competition created successfully",
		"data":    created,
	})
}
