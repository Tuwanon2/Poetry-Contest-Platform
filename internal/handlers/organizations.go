package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"productproject/internal/klon"
)

// GetUserOrganizations - ดึง organizations ที่ user เป็นสมาชิก
func (h *KlonHandlers) GetUserOrganizations(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	orgs, err := h.db.GetUserOrganizations(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orgs)
}

// CreateOrganization - สร้าง organization ใหม่
func (h *KlonHandlers) CreateOrganization(c *gin.Context) {
	var req struct {
		Name                string `json:"name"`
		Description         string `json:"description"`
		CoverImage          string `json:"cover_image"`
		CertificateDocument string `json:"certificate_document"`
		CreatorUserID       int    `json:"creator_user_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	org := klon.Organization{
		Name:                req.Name,
		Description:         req.Description,
		CoverImage:          req.CoverImage,
		CertificateDocument: req.CertificateDocument,
		CreatorUserID:       req.CreatorUserID,
		Status:              "pending",
	}

	created, err := h.db.CreateOrganization(c.Request.Context(), org)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, created)
}

// GetOrganization - ดูรายละเอียด organization
func (h *KlonHandlers) GetOrganization(c *gin.Context) {
	orgID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
		return
	}

	org, err := h.db.GetOrganization(c.Request.Context(), orgID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Organization not found"})
		return
	}

	c.JSON(http.StatusOK, org)
}

// GetOrganizationMembers - ดูสมาชิกของ organization
func (h *KlonHandlers) GetOrganizationMembers(c *gin.Context) {
	orgID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
		return
	}

	members, err := h.db.GetOrganizationMembers(c.Request.Context(), orgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, members)
}

// GetOrganizationCompetitions - ดึงการประกวดทั้งหมดที่ organization จัด
func (h *KlonHandlers) GetOrganizationCompetitions(c *gin.Context) {
	orgID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
		return
	}

	competitions, err := h.db.GetCompetitionsByOrganizationID(c.Request.Context(), orgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, competitions)
}

// InviteMember - เชิญสมาชิกเข้า organization (ไม่มี role ที่นี่)
func (h *KlonHandlers) InviteMember(c *gin.Context) {
	orgID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
		return
	}

	var req struct {
		Email string `json:"email" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user จาก email
	users, err := h.db.SearchUsersByEmail(c.Request.Context(), req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search user"})
		return
	}

	if len(users) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	userID := users[0].ID

	// เชิญสมาชิก (สร้าง record ใน organization_members โดย status = pending, ไม่มี role)
	err = h.db.InviteOrganizationMember(c.Request.Context(), orgID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invitation sent successfully"})
}

// AcceptOrganizationInvitation - ยอมรับคำเชิญเข้า organization
func (h *KlonHandlers) AcceptOrganizationInvitation(c *gin.Context) {
	memberID, err := strconv.Atoi(c.Param("memberId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid member ID"})
		return
	}

	// อัพเดท status เป็น accepted
	err = h.db.UpdateMemberStatus(c.Request.Context(), memberID, "accepted")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invitation accepted"})
}

// RejectOrganizationInvitation - ปฏิเสธคำเชิญและลบ record
func (h *KlonHandlers) RejectOrganizationInvitation(c *gin.Context) {
	memberID, err := strconv.Atoi(c.Param("memberId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid member ID"})
		return
	}

	// ลบ record ออกจาก organization_members
	err = h.db.DeleteOrganizationMember(c.Request.Context(), memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invitation rejected"})
}
// ==================== ASSISTANTS (ผู้ช่วยระดับ org - role='assistant') ====================

// GetOrganizationAssistants - ดึงรายการผู้ช่วยทั้งหมดของ organization
func (h *KlonHandlers) GetOrganizationAssistants(c *gin.Context) {
	orgID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
		return
	}

	assistants, err := h.db.GetAssistants(c.Request.Context(), orgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, assistants)
}

// InviteOrganizationAssistant - เชิญผู้ช่วยเข้า organization พร้อมกำหนดสิทธิ
func (h *KlonHandlers) InviteOrganizationAssistant(c *gin.Context) {
	orgID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
		return
	}

	var req struct {
		Email                string `json:"email" binding:"required"`
		CanView              bool   `json:"can_view"`
		CanEdit              bool   `json:"can_edit"`
		CanViewScores        bool   `json:"can_view_scores"`
		CanAddAssistant      bool   `json:"can_add_assistant"`
		CanCreateCompetition bool   `json:"can_create_competition"`
		InvitedBy            int    `json:"invited_by" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user จาก email
	users, err := h.db.SearchUsersByEmail(c.Request.Context(), req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search user"})
		return
	}

	if len(users) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	userID := users[0].ID

	// เชิญผู้ช่วย
	err = h.db.InviteAssistant(c.Request.Context(), orgID, userID, req.InvitedBy, req.CanView, req.CanEdit, req.CanViewScores, req.CanAddAssistant, req.CanCreateCompetition)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Assistant invited successfully"})
}

// UpdateAssistantPermissions - อัปเดตสิทธิของผู้ช่วย
func (h *KlonHandlers) UpdateAssistantPermissions(c *gin.Context) {
	memberID, err := strconv.Atoi(c.Param("memberId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid member ID"})
		return
	}

	var req struct {
		CanView              bool `json:"can_view"`
		CanEdit              bool `json:"can_edit"`
		CanViewScores        bool `json:"can_view_scores"`
		CanAddAssistant      bool `json:"can_add_assistant"`
		CanCreateCompetition bool `json:"can_create_competition"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.db.UpdateAssistantPermissions(c.Request.Context(), memberID, req.CanView, req.CanEdit, req.CanViewScores, req.CanAddAssistant, req.CanCreateCompetition)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Permissions updated successfully"})
}