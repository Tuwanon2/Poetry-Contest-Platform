package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
)

func (h *KlonHandlers) CreateSubmission(c *gin.Context) {
    var req struct {
        CompetitionID int    `json:"competition_id" binding:"required"`
        UserID        *int   `json:"user_id"`
        Name          string `json:"name" binding:"required"`
        Email         string `json:"email" binding:"required"`
        Phone         string `json:"phone"`
        LevelName     string `json:"level_name" binding:"required"`
        Title         string `json:"title" binding:"required"`
        PoemType      string `json:"poem_type" binding:"required"`
        Content       string `json:"content" binding:"required"`
        Document      string `json:"document"`
    }
    if err := c.ShouldBindJSON(&req); err != nil { 
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return 
    }
    
    submission, err := h.db.CreateSubmission(
        c.Request.Context(),
        req.CompetitionID,
        req.UserID,
        req.Name,
        req.Email,
        req.Phone,
        req.LevelName,
        req.Title,
        req.PoemType,
        req.Content,
        req.Document,
    )
    if err != nil { 
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return 
    }
    c.JSON(http.StatusCreated, submission)
}

func (h *KlonHandlers) GetSubmission(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    w, err := h.db.GetSubmission(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, w)
}

func (h *KlonHandlers) UpdateSubmission(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req struct{ Title, Content string }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    w, err := h.db.UpdateSubmission(c.Request.Context(), id, req.Title, req.Content)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, w)
}

func (h *KlonHandlers) DeleteSubmission(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.db.DeleteSubmission(c.Request.Context(), id); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusNoContent)
}

func (h *KlonHandlers) GetSubmissionStatus(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    st, err := h.db.GetSubmissionStatus(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, st)
}

func (h *KlonHandlers) GetUserSubmissions(c *gin.Context) {
    userID, _ := strconv.Atoi(c.Param("userId"))
    submissions, err := h.db.GetUserSubmissions(c.Request.Context(), userID)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, submissions)
}
