// main.go

package main

import (
	"context"
	"log"
	"productproject/internal/config"
	"productproject/internal/handlers"
	"productproject/internal/klon"
	"time"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
  return func(c *gin.Context) {
    ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
    defer cancel()
    c.Request = c.Request.WithContext(ctx)
    c.Next()
  }
}

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// TODO: connect to klon db (implement NewKlonDatabase)
	var klonDB klon.KlonDatabase = nil // <- replace with real db
	kh := handlers.NewKlonHandlers(klonDB)

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	configCors := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:4000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(configCors))
	r.Use(TimeoutMiddleware(5 * time.Second))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
	{
		// ตัวอย่าง route สำหรับ users
		v1.GET("/users/:id", kh.GetUser)
		v1.POST("/users", kh.CreateUser)
		// TODO: เพิ่ม route สำหรับ competitions, applicants, works, judges, scores
	}

	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Printf("Failed to run server: %v", err)
	}
}
