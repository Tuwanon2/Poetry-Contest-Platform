package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// CreateSubmission แก้ไขใหม่เพื่อรองรับ FormData และ File Upload
func (h *KlonHandlers) CreateSubmission(c *gin.Context) {
	// 1. รับค่า CompetitionID (แปลง String -> Int)
	compIDStr := c.PostForm("competition_id")
	compID, err := strconv.Atoi(compIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid competition_id"})
		return
	}

	// 2. รับค่า UserID (แปลง String -> *Int)
	var userID *int
	userIDStr := c.PostForm("user_id")
	if userIDStr != "" && userIDStr != "undefined" && userIDStr != "null" {
		if uid, err := strconv.Atoi(userIDStr); err == nil {
			userID = &uid
		}
	}

	// 3. จัดการไฟล์แนบ (Document)
	documentPath := ""
	file, err := c.FormFile("document") // ต้องตรงกับชื่อ key ใน frontend
	if err == nil {
		// ถ้ามีไฟล์แนบมา ให้บันทึก
		uploadDir := "uploads/submissions"
		
		// สร้างโฟลเดอร์ถ้ายังไม่มี
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			os.MkdirAll(uploadDir, 0755)
		}

		// ตั้งชื่อไฟล์ใหม่: compID_timestamp_filename เพื่อกันชื่อซ้ำ
		ext := filepath.Ext(file.Filename)
		filename := fmt.Sprintf("%d_%d%s", compID, time.Now().UnixNano(), ext)
		dst := filepath.Join(uploadDir, filename)

		if err := c.SaveUploadedFile(file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		// Path ที่จะบันทึกลง DB (เพื่อให้ Frontend เรียกใช้ได้ผ่าน Static URL)
		// ต้องแน่ใจว่าใน main.go มี r.Static("/uploads", "./uploads")
		documentPath = "/uploads/submissions/" + filename
	}

	// 4. บันทึกลง Database
	submission, err := h.db.CreateSubmission(
		c.Request.Context(),
		compID,
		userID,
		c.PostForm("name"),       // รับค่าจาก Form
		c.PostForm("email"),
		c.PostForm("phone"),
		c.PostForm("level_name"),
		c.PostForm("title"),
		c.PostForm("poem_type"),
		c.PostForm("content"),
		documentPath,             // ส่ง Path รูป/ไฟล์ ที่เซฟได้
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, submission)
}

// --- ฟังก์ชันด้านล่างเหมือนเดิม ---

func (h *KlonHandlers) GetSubmission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	w, err := h.db.GetSubmission(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, w)
}

func (h *KlonHandlers) UpdateSubmission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req struct{ Title, Content string }
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	w, err := h.db.UpdateSubmission(c.Request.Context(), id, req.Title, req.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, w)
}

func (h *KlonHandlers) DeleteSubmission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.db.DeleteSubmission(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *KlonHandlers) GetSubmissionStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	st, err := h.db.GetSubmissionStatus(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, st)
}

func (h *KlonHandlers) GetUserSubmissions(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("userId"))
	submissions, err := h.db.GetUserSubmissions(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, submissions)
}