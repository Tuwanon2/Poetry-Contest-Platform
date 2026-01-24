package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ==================== JUDGES (กรรมการระดับการประกวด) ====================

// GetCompetitionJudges - ดึงกรรมการทั้งหมดในการประกวด
func (h *KlonHandlers) GetCompetitionJudges(c *gin.Context) {
	competitionID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid competition ID"})
		return
	}

	judges, err := h.db.GetCompetitionJudges(c.Request.Context(), competitionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, judges)
}

// InviteCompetitionJudge - เชิญกรรมการเข้าการประกวด (ต้องระบุ level)
func (h *KlonHandlers) InviteCompetitionJudge(c *gin.Context) {
	competitionID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid competition ID"})
		return
	}

	var req struct {
		UserID  int `json:"user_id" binding:"required"`
		LevelID int `json:"level_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ดึง invitedBy จาก JWT หรือ session (ตอนนี้ใช้ default 0 ก่อน)
	invitedBy := 1 // TODO: ดึงจาก authenticated user

	err = h.db.InviteCompetitionJudge(c.Request.Context(), competitionID, req.UserID, req.LevelID, invitedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Judge invited successfully"})
}

// RemoveCompetitionJudge - ลบกรรมการออกจากการประกวด
func (h *KlonHandlers) RemoveCompetitionJudge(c *gin.Context) {
	judgeID, err := strconv.Atoi(c.Param("judgeId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid judge ID"})
		return
	}

	err = h.db.RemoveCompetitionJudge(c.Request.Context(), judgeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Judge removed successfully"})
}
