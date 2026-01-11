// main.go

package main

import (
	"context"
	"log"
	"productproject/internal/config"
	"productproject/internal/handlers"
	"productproject/internal/klon"
	"productproject/internal/routes"
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

	// Connect klon DB
	connStr := cfg.GetConnectionString()
	klonDB, err := klon.NewPostgresKlonDB(connStr)
	if err != nil {
		log.Fatalf("failed to connect klon db: %v", err)
	}
	kh := handlers.NewKlonHandlers(klonDB)

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	configCors := cors.Config{
		// Allow both localhost and 127.0.0.1 origins for common dev setups
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:4000", "http://127.0.0.1:4000"},
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

	// Public register route (should be accessible without auth middleware)
	r.POST("/api/v1/auth/register", kh.Register)

	v1 := r.Group("/api/v1")
	routes.Register(v1, kh)

	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Printf("Failed to run server: %v", err)
	}
}
