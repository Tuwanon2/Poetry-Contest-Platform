package handlers

import (
    "crypto/sha256"
    "encoding/hex"
    "fmt"
    "net/http"
    "path/filepath"
    "strings"
    "time"
    "os"

    "github.com/gin-gonic/gin"
)

// UploadPoster handles poster uploads (multipart form) and returns a URL/path
func (h *KlonHandlers) UploadPoster(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
        return
    }

    // Validate file type (images only)
    allowedExts := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true}
    ext := strings.ToLower(filepath.Ext(file.Filename))
    if !allowedExts[ext] {
        c.JSON(http.StatusBadRequest, gin.H{"error": "only image files are allowed (jpg, png, gif, webp)"})
        return
    }

    // Validate file size (max 5MB)
    if file.Size > 5*1024*1024 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "file size exceeds 5MB limit"})
        return
    }

    // Create directory structure: /DB_poem/uploads/posters/YYYY/MM/
    now := time.Now()
    uploadDir := filepath.Join("/DB_poem", "uploads", "posters", fmt.Sprintf("%d", now.Year()), fmt.Sprintf("%02d", now.Month()))
    if err := os.MkdirAll(uploadDir, 0755); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create upload directory"})
        return
    }

    // Generate unique filename using hash + timestamp
    hash := sha256.New()
    hash.Write([]byte(file.Filename + now.String()))
    hashStr := hex.EncodeToString(hash.Sum(nil))[:12]
    
    filename := fmt.Sprintf("poster_%s_%d%s", hashStr, now.Unix(), ext)
    dest := filepath.Join(uploadDir, filename)

    // Save file
    if err := c.SaveUploadedFile(file, dest); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
        return
    }

    // Return relative URL path (will be accessible via /uploads/posters/YYYY/MM/filename)
    relativeURL := fmt.Sprintf("/uploads/posters/%d/%02d/%s", now.Year(), now.Month(), filename)
    
    c.JSON(http.StatusOK, gin.H{
        "url": relativeURL,
        "filename": filename,
        "size": file.Size,
    })
}
