package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// ============ Organization Management ============

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

// ============ Dashboard Statistics ============

// GetDashboardStats - ดึงสถิติรวมสำหรับ Dashboard
func (h *KlonHandlers) GetDashboardStats(c *gin.Context) {
	db := h.db.GetDB()

	// จำนวนการประกวดทั้งหมด
	var totalCompetitions int
	db.QueryRow("SELECT COUNT(*) FROM competitions").Scan(&totalCompetitions)

	// จำนวนผลงานทั้งหมด
	var totalSubmissions int
	db.QueryRow("SELECT COUNT(*) FROM submissions").Scan(&totalSubmissions)

	// จำนวนผู้ใช้ทั้งหมด
	var totalUsers int
	db.QueryRow("SELECT COUNT(*) FROM users").Scan(&totalUsers)

	// จำนวนผู้ใช้ตามบทบาท
	usersByRole := map[string]int{
		"applicants": 0,
		"judges":     0,
		"organizers": 0,
		"assistants": 0,
	}
	rows, err := db.Query("SELECT role, COUNT(*) as count FROM users GROUP BY role")
	if err == nil {
		for rows.Next() {
			var role string
			var count int
			rows.Scan(&role, &count)
			if role == "user" || role == "applicant" {
				usersByRole["applicants"] = count
			} else if role == "judge" {
				usersByRole["judges"] = count
			} else if role == "organizer" {
				usersByRole["organizers"] = count
			} else if role == "assistant" {
				usersByRole["assistants"] = count
			}
		}
		rows.Close()
	}

	// นับจำนวน judges ที่ได้รับมอบหมายจริงๆ จากตาราง judges
	var totalJudges int
	db.QueryRow("SELECT COUNT(DISTINCT user_id) FROM judges WHERE status = 'accepted'").Scan(&totalJudges)
	usersByRole["judges"] = totalJudges

	// นับจำนวน organizations
	var totalOrganizations int
	db.QueryRow("SELECT COUNT(*) FROM organizations WHERE status = 'approved'").Scan(&totalOrganizations)

	// สถานะผลงาน - นับจากว่ามี score หรือยัง
	var pending, scored int
	db.QueryRow(`
		SELECT 
			COUNT(CASE WHEN NOT EXISTS (SELECT 1 FROM submission_scores WHERE submission_id = s.submission_id) THEN 1 END) as pending,
			COUNT(CASE WHEN EXISTS (SELECT 1 FROM submission_scores WHERE submission_id = s.submission_id) THEN 1 END) as scored
		FROM submissions s
	`).Scan(&pending, &scored)
	
	submissionsByStatus := map[string]int{
		"pending":     pending,
		"underReview": 0,      // placeholder
		"scored":      scored,
	}

	// การประกวดที่เปิดรับสมัคร
	openCompetitions := []map[string]interface{}{}
	rows, err = db.Query(`
		SELECT c.competition_id, c.title, c.end_date,
			COUNT(s.submission_id) as submissions_count
		FROM competitions c
		LEFT JOIN submissions s ON c.competition_id = s.competition_id
		WHERE c.end_date > NOW() AND c.status = 'open'
		GROUP BY c.competition_id, c.title, c.end_date
		ORDER BY c.end_date ASC
		LIMIT 5
	`)
	if err == nil {
		for rows.Next() {
			var competitionID int
			var title string
			var endDate time.Time
			var submissionsCount int
			rows.Scan(&competitionID, &title, &endDate, &submissionsCount)
			openCompetitions = append(openCompetitions, map[string]interface{}{
				"competition_id":    competitionID,
				"title":             title,
				"end_date":          endDate,
				"submissions_count": submissionsCount,
			})
		}
		rows.Close()
	}

	// การประกวดที่ใกล้ปิดรับผลงาน (7 วัน)
	closingSoonCompetitions := []map[string]interface{}{}
	rows, err = db.Query(`
		SELECT c.competition_id, c.title, c.end_date,
			EXTRACT(DAY FROM (c.end_date - NOW()))::int as days_remaining,
			EXISTS(SELECT 1 FROM judges WHERE competition_id = c.competition_id) as has_judges
		FROM competitions c
		WHERE c.end_date > NOW() AND c.end_date < NOW() + INTERVAL '7 days'
		ORDER BY c.end_date ASC
	`)
	if err == nil {
		for rows.Next() {
			var competitionID int
			var title string
			var endDate time.Time
			var daysRemaining int
			var hasJudges bool
			rows.Scan(&competitionID, &title, &endDate, &daysRemaining, &hasJudges)
			closingSoonCompetitions = append(closingSoonCompetitions, map[string]interface{}{
				"competition_id":  competitionID,
				"title":           title,
				"end_date":        endDate,
				"days_remaining":  daysRemaining,
				"has_judges":      hasJudges,
			})
		}
		rows.Close()
	}

	// กิจกรรมล่าสุด - ดึงจาก submissions ล่าสุด
	recentActivities := []map[string]interface{}{}
	rows, err = db.Query(`
		SELECT s.submission_id, s.title, u.name as user_name, 'applicant' as user_type, 
			   'ส่งผลงาน' as action, s.submitted_at as created_at
		FROM submissions s
		LEFT JOIN users u ON s.user_id = u.user_id
		ORDER BY s.submitted_at DESC
		LIMIT 10
	`)
	if err == nil {
		for rows.Next() {
			var submissionID int
			var title, userName, userType, action string
			var createdAt time.Time
			rows.Scan(&submissionID, &title, &userName, &userType, &action, &createdAt)
			recentActivities = append(recentActivities, map[string]interface{}{
				"user_name":  userName,
				"user_type":  userType,
				"action":     action + " \"" + title + "\"",
				"created_at": createdAt,
			})
		}
		rows.Close()
	}

	// Response
	c.JSON(http.StatusOK, map[string]interface{}{
		"totalCompetitions":        totalCompetitions,
		"totalSubmissions":         totalSubmissions,
		"totalUsers":               totalUsers,
		"totalOrganizations":       totalOrganizations,
		"usersByRole":              usersByRole,
		"submissionsByStatus":      submissionsByStatus,
		"openCompetitions":         openCompetitions,
		"closingSoonCompetitions":  closingSoonCompetitions,
		"recentActivities":         recentActivities,
	})
}

// ============ Users Management ============

// GetAllUsers - ดึงรายการผู้ใช้ทั้งหมด
func (h *KlonHandlers) GetAllUsers(c *gin.Context) {
	db := h.db.GetDB()
	rows, err := db.Query(`
		SELECT user_id, name, email, role, is_active, created_at
		FROM users
		ORDER BY created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	users := []map[string]interface{}{}
	for rows.Next() {
		var userID int
		var name, email, role string
		var isActive bool
		var createdAt time.Time
		rows.Scan(&userID, &name, &email, &role, &isActive, &createdAt)
		users = append(users, map[string]interface{}{
			"user_id":    userID,
			"name":       name,
			"email":      email,
			"role":       role,
			"is_active":  isActive,
			"created_at": createdAt,
		})
	}

	c.JSON(http.StatusOK, users)
}

// UpdateUserRole - เปลี่ยนบทบาทผู้ใช้
func (h *KlonHandlers) UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")
	var req struct {
		Role string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	db := h.db.GetDB()
	_, err := db.Exec("UPDATE users SET role = $1 WHERE user_id = $2", req.Role, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully"})
}

// UpdateUserStatus - เปลี่ยนสถานะผู้ใช้ (ระงับ/ปลดแบน)
func (h *KlonHandlers) UpdateUserStatus(c *gin.Context) {
	userID := c.Param("id")
	var req struct {
		IsActive bool `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	db := h.db.GetDB()
	_, err := db.Exec("UPDATE users SET is_active = $1 WHERE user_id = $2", req.IsActive, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User status updated successfully"})
}

// ============ Competitions Management ============

// GetAllCompetitionsAdmin - ดึงรายการการประกวดทั้งหมดสำหรับ Admin
func (h *KlonHandlers) GetAllCompetitionsAdmin(c *gin.Context) {
	db := h.db.GetDB()
	rows, err := db.Query(`
		SELECT c.competition_id, c.title, c.description, c.poem_type, c.start_date, c.end_date, c.status,
			COUNT(DISTINCT l.level_id) as levels_count,
			COUNT(DISTINCT s.submission_id) as submissions_count,
			COUNT(DISTINCT j.judge_id) as judges_count
		FROM competitions c
		LEFT JOIN levels l ON c.competition_id = l.competition_id
		LEFT JOIN submissions s ON c.competition_id = s.competition_id
		LEFT JOIN judges j ON c.competition_id = j.competition_id
		GROUP BY c.competition_id
		ORDER BY c.created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch competitions"})
		return
	}
	defer rows.Close()

	competitions := []map[string]interface{}{}
	for rows.Next() {
		var competitionID int
		var title, description, poemType, status string
		var startDate, endDate time.Time
		var levelsCount, submissionsCount, judgesCount int
		rows.Scan(&competitionID, &title, &description, &poemType, &startDate, &endDate, &status,
			&levelsCount, &submissionsCount, &judgesCount)
		
		competitions = append(competitions, map[string]interface{}{
			"competition_id":     competitionID,
			"title":              title,
			"description":        description,
			"poem_type":          poemType,
			"start_date":         startDate,
			"end_date":           endDate,
			"status":             status,
			"levels_count":       levelsCount,
			"submissions_count":  submissionsCount,
			"judges_count":       judgesCount,
		})
	}

	c.JSON(http.StatusOK, competitions)
}

// DeleteCompetition - ลบการประกวด
func (h *KlonHandlers) DeleteCompetition(c *gin.Context) {
	competitionID := c.Param("id")

	db := h.db.GetDB()
	_, err := db.Exec("DELETE FROM competitions WHERE competition_id = $1", competitionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete competition"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Competition deleted successfully"})
}

// UpdateCompetitionStatus - เปลี่ยนสถานะการประกวด
func (h *KlonHandlers) UpdateCompetitionStatus(c *gin.Context) {
	competitionID := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	db := h.db.GetDB()
	_, err := db.Exec("UPDATE competitions SET status = $1 WHERE competition_id = $2", req.Status, competitionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update competition status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Competition status updated successfully"})
}

// ============ Submissions Management ============

// GetAllSubmissionsAdmin - ดึงรายการผลงานทั้งหมดสำหรับ Admin
func (h *KlonHandlers) GetAllSubmissionsAdmin(c *gin.Context) {
	db := h.db.GetDB()
	rows, err := db.Query(`
		SELECT s.submission_id, s.title, s.poem_type, s.submitted_at,
			s.name as author_name, s.email as author_email,
			c.title as competition_title,
			l.name as level_name,
			AVG(ss.score) as average_score,
			EXISTS(SELECT 1 FROM submission_scores WHERE submission_id = s.submission_id) as is_scored
		FROM submissions s
		JOIN competitions c ON s.competition_id = c.competition_id
		LEFT JOIN levels l ON s.level_id = l.level_id
		LEFT JOIN submission_scores ss ON s.submission_id = ss.submission_id
		GROUP BY s.submission_id, c.title, l.name
		ORDER BY s.submitted_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch submissions"})
		return
	}
	defer rows.Close()

	submissions := []map[string]interface{}{}
	for rows.Next() {
		var submissionID int
		var title, poemType, authorName, authorEmail, competitionTitle, levelName string
		var submittedAt time.Time
		var averageScore *float64
		var isScored bool
		rows.Scan(&submissionID, &title, &poemType, &submittedAt, &authorName, &authorEmail,
			&competitionTitle, &levelName, &averageScore, &isScored)
		
		submissions = append(submissions, map[string]interface{}{
			"submission_id":      submissionID,
			"title":              title,
			"poem_type":          poemType,
			"submitted_at":       submittedAt,
			"author_name":        authorName,
			"author_email":       authorEmail,
			"competition_title":  competitionTitle,
			"level_name":         levelName,
			"average_score":      averageScore,
			"is_scored":          isScored,
			"status":             "pending", // Default status
		})
	}

	c.JSON(http.StatusOK, submissions)
}

// Stub handlers for TODO routes
func (h *KlonHandlers) ResetUserPassword(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) UpdateSubmissionStatus(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) SetSubmissionAward(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) GetAllJudges(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) RemoveJudgeAssignment(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) GetCompetitionResults(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) AnnounceResults(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) ExportResults(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) GetCompetitionReport(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) ExportReport(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) GetSettings(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) UpdateSettings(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func (h *KlonHandlers) BackupDatabase(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

// GetLogs - ดึงรายการ logs
func (h *KlonHandlers) GetLogs(c *gin.Context) {
	db := h.db.GetDB()
	
	// รับ query parameters
	userType := c.Query("user_type")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	limit := c.DefaultQuery("limit", "100")
	
	// สร้าง query
	query := `
		SELECT log_id, user_id, user_type, user_name, action, 
		       entity_type, entity_id, ip_address, created_at
		FROM activity_logs
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 0
	
	if userType != "" {
		argCount++
		query += " AND user_type = $" + strconv.Itoa(argCount)
		args = append(args, userType)
	}
	
	if startDate != "" {
		argCount++
		query += " AND created_at >= $" + strconv.Itoa(argCount)
		args = append(args, startDate)
	}
	
	if endDate != "" {
		argCount++
		query += " AND created_at <= $" + strconv.Itoa(argCount)
		args = append(args, endDate)
	}
	
	query += " ORDER BY created_at DESC LIMIT $" + strconv.Itoa(argCount+1)
	args = append(args, limit)
	
	rows, err := db.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}
	defer rows.Close()
	
	logs := []map[string]interface{}{}
	for rows.Next() {
		var logID, userID, entityID *int
		var userType, userName, action, entityType, ipAddress *string
		var createdAt time.Time
		
		err := rows.Scan(&logID, &userID, &userType, &userName, &action, 
			&entityType, &entityID, &ipAddress, &createdAt)
		if err != nil {
			continue
		}
		
		log := map[string]interface{}{
			"log_id":     logID,
			"created_at": createdAt,
		}
		
		if userID != nil {
			log["user_id"] = *userID
		}
		if userType != nil {
			log["user_type"] = *userType
		}
		if userName != nil {
			log["user_name"] = *userName
		}
		if action != nil {
			log["action"] = *action
		}
		if entityType != nil {
			log["entity_type"] = *entityType
		}
		if entityID != nil {
			log["entity_id"] = *entityID
		}
		if ipAddress != nil {
			log["ip_address"] = *ipAddress
		}
		
		logs = append(logs, log)
	}
	
	c.JSON(http.StatusOK, logs)
}
