package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
)

func (h *KlonHandlers) CreateSubmission(c *gin.Context) {
    var req struct {
        UserID    int    `json:"user_id"`
        ContestID int    `json:"contest_id"`
        Title     string `json:"title"`
        Content   string `json:"content"`
    }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    w, err := h.db.CreateSubmission(c.Request.Context(), req.UserID, req.ContestID, req.Title, req.Content)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, w)
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
