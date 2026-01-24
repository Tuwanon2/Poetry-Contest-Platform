package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetPendingOrganizations - ดึงรายการ organizations ที่รอการอนุมัติ
func (h *KlonHandlers) GetPendingOrganizations(c *gin.Context) {
	organizations, err := h.db.GetPendingOrganizations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending organizations"})
		return
	}

	c.JSON(http.StatusOK, organizations)
}

// UpdateOrganizationStatus - อนุมัติหรือปฏิเสธ organization
func (h *KlonHandlers) UpdateOrganizationStatus(c *gin.Context) {
	orgIDStr := c.Param("id")
	orgID, err := strconv.Atoi(orgIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"` // "approved" หรือ "rejected"
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// ตรวจสอบว่า status ถูกต้อง
	if req.Status != "approved" && req.Status != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status must be 'approved' or 'rejected'"})
		return
	}

	err = h.db.UpdateOrganizationStatus(orgID, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update organization status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Organization status updated successfully"})
}
