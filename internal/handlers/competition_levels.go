package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ScoringCriteria struct {
	Name     string `json:"name"`
	MaxScore int    `json:"max_score"`
}

func (h *KlonHandlers) UpdateCompetitionLevelCriteria(c *gin.Context) {
	levelID := c.Param("id")
	
	// Parse request body
	var request struct {
		ScoringCriteria []ScoringCriteria `json:"scoring_criteria"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Convert criteria to JSON
	criteriaJSON, err := json.Marshal(request.ScoringCriteria)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal criteria"})
		return
	}

	// Update database
	query := `
		UPDATE competition_levels 
		SET scoring_criteria = $1
		WHERE competition_level_id = $2
	`
	
	levelIDInt, err := strconv.Atoi(levelID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid level ID"})
		return
	}
	
	_, err = h.db.GetDB().ExecContext(context.Background(), query, criteriaJSON, levelIDInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update criteria"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Scoring criteria updated successfully",
		"scoring_criteria": request.ScoringCriteria,
	})
}
