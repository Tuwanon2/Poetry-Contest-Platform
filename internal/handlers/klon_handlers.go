package handlers

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"productproject/internal/klon"
)

type KlonHandlers struct {
	db klon.KlonDatabase
}

func NewKlonHandlers(db klon.KlonDatabase) *KlonHandlers {
	return &KlonHandlers{db: db}
}

// Example: GET /api/v1/users/:id
func (h *KlonHandlers) GetUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	user, err := h.db.GetUserByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// Example: POST /api/v1/users
func (h *KlonHandlers) CreateUser(c *gin.Context) {
	var user klon.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	created, err := h.db.CreateUser(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

// เพิ่ม handler อื่นๆ (competition, applicant, work, judge, score) ตาม interface ใน klon.go ได้เลย
