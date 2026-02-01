package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	supabase "github.com/supabase-community/supabase-go"
)

func (h *KlonHandlers) UploadPoster(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	// ---------- VALIDATION ----------
	allowedExts := map[string]bool{
		".jpg": true, ".jpeg": true, ".png": true,
		".gif": true, ".webp": true,
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedExts[ext] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "only image files are allowed (jpg, png, gif, webp)",
		})
		return
	}

	if file.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "file size exceeds 5MB limit",
		})
		return
	}

	// ---------- LOAD SUPABASE CONFIG ----------
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Supabase credentials are not set in environment variables",
		})
		return
	}

	client, err := supabase.NewClient(supabaseURL, supabaseKey, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to connect to Supabase"})
		return
	}

	// ---------- GENERATE FILENAME ----------
	now := time.Now()
	hash := sha256.New()
	hash.Write([]byte(file.Filename + now.String()))
	hashStr := hex.EncodeToString(hash.Sum(nil))[:12]

	filename := fmt.Sprintf("poster_%s_%d%s", hashStr, now.Unix(), ext)
	pathInBucket := fmt.Sprintf("posters/%d/%02d/%s", now.Year(), now.Month(), filename)

	// ---------- READ FILE ----------
	fileReader, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file"})
		return
	}
	defer fileReader.Close()

	// ---------- UPLOAD TO SUPABASE STORAGE ----------
	bucketName := "product-images"

	// สำหรับ supabase-go v0.0.4: 
	// client.Storage จะคืนค่าเป็น *storage_go.Client
	// ในเวอร์ชันนี้ Method การอัปโหลดจะชื่อว่า 'UploadFile' 
	// และรับ parameter เป็น (bucketId, relativePath, data)
	
	resp, err := client.Storage.UploadFile(bucketName, pathInBucket, fileReader)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "failed to upload to Supabase",
			"detail": err.Error(),
		})
		return
	}

	// ตรวจสอบว่ามี Error Message ใน Response หรือไม่
	if strings.Contains(resp, "error") {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to upload to Supabase",
			"detail": resp,
		})
		return
	}

	// ---------- BUILD PUBLIC URL ----------
	publicURL := fmt.Sprintf(
		"%s/storage/v1/object/public/%s/%s",
		supabaseURL,
		bucketName,
		pathInBucket,
	)

	c.JSON(http.StatusOK, gin.H{
		"url":      publicURL,
		"filename": filename,
		"size":     file.Size,
	})
}