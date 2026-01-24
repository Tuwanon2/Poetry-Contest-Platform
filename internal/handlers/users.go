package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "productproject/internal/klon"
)

func (h *KlonHandlers) GetUser(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"}); return }
    user, err := h.db.GetUserByID(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, user)
}

func (h *KlonHandlers) CreateUser(c *gin.Context) {
    var user klon.User
    if err := c.ShouldBindJSON(&user); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    created, err := h.db.CreateUser(c.Request.Context(), user)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, created)
}

func (h *KlonHandlers) ListUsers(c *gin.Context) {
    users, err := h.db.ListUsers(c.Request.Context())
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, users)
}

func (h *KlonHandlers) SearchUsersByEmail(c *gin.Context) {
    q := c.Query("q")
    if q == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "q query parameter required"})
        return
    }
    users, err := h.db.SearchUsersByEmail(c.Request.Context(), q)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, users)
}
