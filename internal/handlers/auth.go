package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "productproject/internal/klon"
)

func (h *KlonHandlers) Register(c *gin.Context) {
    var req struct{ Username, Password, FullName, Email, Role string }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    u := klon.User{Username: req.Username, FullName: req.FullName, Email: req.Email, Role: req.Role}
    created, err := h.db.Register(c.Request.Context(), u, req.Password)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, created)
}

func (h *KlonHandlers) Login(c *gin.Context) {
    var req struct{ Username, Password string }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    u, err := h.db.Login(c.Request.Context(), req.Username, req.Password)
    if err != nil { c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"user": u})
}

func (h *KlonHandlers) Logout(c *gin.Context) {
    c.Status(http.StatusOK)
}
