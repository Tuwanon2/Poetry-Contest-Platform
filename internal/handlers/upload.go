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
	"io"

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

	// ---------- LOAD SUPABASE CONFIG FROM ENV ----------
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

	// ---------- GENERATE UNIQUE FILENAME (ดีแล้ว เก็บไว้) ----------
	now := time.Now()
	hash := sha256.New()
	hash.Write([]byte(file.Filename + now.String()))
	hashStr := hex.EncodeToString(hash.Sum(nil))[:12]

	filename := fmt.Sprintf("poster_%s_%d%s", hashStr, now.Unix(), ext)

	// Path ใน bucket
	pathInBucket := fmt.Sprintf(
		"posters/%d/%02d/%s",
		now.Year(),
		now.Month(),
		filename,
	)

	// ---------- READ FILE INTO BYTES (สำคัญ) ----------
	fileReader, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file"})
		return
	}
	defer fileReader.Close()

	fileBytes, err := io.ReadAll(fileReader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file content"})
		return
	}

	// ---------- UPLOAD TO SUPABASE STORAGE ----------
	bucketName := "poem-images" // ← เปลี่ยนให้ตรงกับ bucket ของคุณ

	_, err = client.Storage.
		From(bucketName).
		Upload(pathInBucket, fileBytes, supabase.StorageOptions{
			ContentType: file.Header.Get("Content-Type"),
			Upsert:      false,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to upload to Supabase",
			"detail": err.Error(),
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

	// ---------- RETURN RESPONSE ----------
	c.JSON(http.StatusOK, gin.H{
		"url":      publicURL,
		"filename": filename,
		"size":     file.Size,
	})
}
