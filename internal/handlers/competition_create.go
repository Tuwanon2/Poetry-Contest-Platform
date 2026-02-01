package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"productproject/internal/klon"
)

// CreateCompetitionWithFormData handles competition creation
func (h *KlonHandlers) CreateCompetitionWithFormData(c *gin.Context) {
	// 1. รับค่าจาก Frontend (FormData)
	name := c.PostForm("name")
	orgIDStr := c.PostForm("organization_id")
	regStart := c.PostForm("registration_start")
	regEnd := c.PostForm("registration_end")
	description := c.PostForm("description")
	objective := c.PostForm("objective")
	levelsJSON := c.PostForm("levels_json")
	judgesJSON := c.PostForm("judges_json")

	// 🔥 NEW: รับ URL ของรูปภาพโดยตรง (ไม่ต้องรับไฟล์แล้ว)
	posterPath := c.PostForm("poster_url")

	// Validation Basic
	if name == "" || orgIDStr == "" || regStart == "" || regEnd == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	orgID, err := strconv.Atoi(orgIDStr)
	if err != nil {
		fmt.Printf("Error parsing OrgID: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization_id"})
		return
	}

	// Parse levels JSON
	var levels []struct {
		LevelName       string                   `json:"level_name"`
		PoemTypes       []string                 `json:"poem_types"`
		TopicMode       string                   `json:"topic_mode"`
		TopicName       string                   `json:"topic_name"`
		Description     string                   `json:"description"`
		ScoringCriteria []map[string]interface{} `json:"scoring_criteria"`
		TotalScore      int                      `json:"total_score"`
	}

	if levelsJSON != "" {
		if err := json.Unmarshal([]byte(levelsJSON), &levels); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid levels_json format: " + err.Error()})
			return
		}
	}

	// 2. สร้าง Object Competition เพื่อเตรียมบันทึก
	comp := klon.Competition{
		Title:             name,
		OrganizationID:    orgID,
		RegistrationStart: regStart,
		RegistrationEnd:   regEnd,
		Description:       description,
		Purpose:           objective,
		PosterURL:         posterPath, // ✅ ใส่ URL ที่ได้จาก React ตรงๆ
		Status:            "draft",
	}

	// 3. บันทึกลง Database
	created, err := h.db.CreateCompetition(c.Request.Context(), comp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create competition: " + err.Error()})
		return
	}

	// 4. บันทึก Levels (Loop สร้าง Level และ Poem Types)
	for _, level := range levels {
		scoringCriteriaJSON, _ := json.Marshal(level.ScoringCriteria)

		// หา level_id จากชื่อ (เช่น "มัธยมศึกษาตอนต้น")
		var levelID int
		err := h.db.GetDB().QueryRowContext(c.Request.Context(),
			`SELECT level_id FROM levels WHERE name = $1`, level.LevelName).Scan(&levelID)

		if err != nil {
			fmt.Printf("Level '%s' not found in levels table: %v\n", level.LevelName, err)
			continue
		}

		// กรณีไม่มีประเภทกลอนระบุมา
		if len(level.PoemTypes) == 0 {
			_, err = h.db.GetDB().ExecContext(c.Request.Context(), `
                INSERT INTO competition_levels 
                (competition_id, level_id, rules, prizes, topic_enabled, topic_name, scoring_criteria)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
				created.ID, levelID, level.Description, nil, level.TopicMode == "fixed", level.TopicName, scoringCriteriaJSON,
			)
			if err != nil {
				fmt.Printf("Failed to create level '%s': %v\n", level.LevelName, err)
			}
		} else {
			// กรณีมีประเภทกลอน (Loop สร้างตามประเภทกลอน)
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
					created.ID, levelID, poemTypeID, level.Description, nil, level.TopicMode == "fixed", level.TopicName, scoringCriteriaJSON,
				)

				if err != nil {
					fmt.Printf("Failed to create level '%s' with poem type '%s': %v\n", level.LevelName, poemTypeName, err)
				}
			}
		}
	}

	// 5. บันทึก Judges (กรรมการ)
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

				// Loop สร้างกรรมการตาม Level ที่รับผิดชอบ
				for _, levelName := range judgeData.Levels {
					var levelID int
					err := h.db.GetDB().QueryRowContext(c.Request.Context(),
						`SELECT level_id FROM levels WHERE name = $1`, levelName).Scan(&levelID)

					if err != nil {
						fmt.Printf("Failed to find level '%s' for judge: %v\n", levelName, err)
						continue
					}

					judge := klon.Judge{
						UserID:        userID,
						CompetitionID: created.ID,
						LevelID:       levelID,
						Status:        "pending",
						InvitedBy:     1, // TODO: เปลี่ยนเป็น ID ของคนล็อกอิน (ถ้ามี Middleware)
					}

					_, err = h.db.CreateJudge(c.Request.Context(), judge)
					if err != nil {
						fmt.Printf("Failed to invite judge %s for level %s: %v\n", judgeData.Email, levelName, err)
					}
				}
			}
		}
	}

	// ส่ง Response กลับไปหา React
	c.JSON(http.StatusCreated, gin.H{
		"message": "Competition created successfully",
		"data":    created,
	})
}