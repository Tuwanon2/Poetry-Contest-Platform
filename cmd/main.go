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
		// ใช้ context.WithTimeout เพื่อตัดการทำงานถ้าเกินเวลาที่กำหนด
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
	log.Printf("Connecting to DB with connStr: %s", connStr)
	klonDB, err := klon.NewPostgresKlonDB(connStr)
	if err != nil {
		log.Fatalf("failed to connect klon db: %v", err)
	}
	kh := handlers.NewKlonHandlers(klonDB)

	gin.SetMode(gin.ReleaseMode)
	// เพิ่ม MaxMultipartMemory เพื่อรองรับไฟล์ขนาดใหญ่ (Default 32MB)
	r := gin.New()
	r.MaxMultipartMemory = 8 << 20 // 8 MiB

	// Logging middleware: log every request
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// --- CORS CONFIG ---
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// อนุญาต origin เฉพาะ FE dev, FE production, และ "null"
			return origin == "null" ||
				origin == "http://localhost:4000" ||
				origin == "https://localhost:4000" ||
				origin == "https://poetry-contest-platform-production.up.railway.app" ||
				origin == "http://poetry-contest-platform-production.up.railway.app" ||
                // 👇 เพิ่ม 2 บรรทัดนี้ (โดเมน Vercel ของคุณ)
                origin == "https://poetry-contest-platform.vercel.app" ||
                origin == "https://poetry-contest-platform-tuwanon2s-projects.vercel.app"
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 🔥 แก้ไข: เพิ่มเวลา Timeout เป็น 30 วินาที เพื่อให้ทันต่อการอัปโหลดไฟล์
	r.Use(TimeoutMiddleware(30 * time.Second))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Explicit OPTIONS handler for CORS preflight (debug)
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204)
	})

	// Serve static files from uploads directory
	// บรรทัดนี้สำคัญมาก! ทำให้ Frontend เปิดดูรูป/ไฟล์ที่อัปโหลดได้
	r.Static("/uploads", "./uploads")

	// Public register/login route
	r.POST("/api/v1/auth/register", kh.Register)

	v1 := r.Group("/api/v1")
	routes.Register(v1, kh)

	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Printf("Failed to run server: %v", err)
	}
}