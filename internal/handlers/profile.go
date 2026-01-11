package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
)

func (h *KlonHandlers) GetProfile(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    u, err := h.db.GetProfile(c.Request.Context(), uid)
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, u)
}

func (h *KlonHandlers) UpdateProfile(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    var updates map[string]interface{}
    if err := c.ShouldBindJSON(&updates); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    u, err := h.db.UpdateProfile(c.Request.Context(), uid, updates)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, u)
}
