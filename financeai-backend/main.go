package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"financeai-backend/routes"
)

func main() {
    // load .env
    godotenv.Load()
    apiKey := os.Getenv("NESSIE_KEY")
    openAIKey := os.Getenv("OPEN_AI_KEY")
    
    if apiKey == "" {
        fmt.Println("⚠️ Nessie API key not found, using mock data only")
    } else {
        fmt.Println("✅ Using Nessie API key from environment")
    }
    
    if openAIKey == "" {
        fmt.Println("❌ OpenAI API key not found in environment variables")
        fmt.Println("Please set OPEN_AI_KEY environment variable")
        os.Exit(1)
    } else {
        fmt.Println("✅ Using OpenAI API key from environment")
        fmt.Printf("🔑 API Key length: %d characters\n", len(openAIKey))
    }

    r := gin.Default()

    // Add simple health check endpoint
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok", "message": "FinSights API is running"})
    })

    // Add CORS middleware
    r.Use(func(c *gin.Context) {
        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        
        c.Next()
    })

    // pass apiKey down to routes
    fmt.Printf("🔧 Registering API routes...\n")
    
    // Add error handling for route registration
    defer func() {
        if r := recover(); r != nil {
            fmt.Printf("❌ Panic during route registration: %v\n", r)
            os.Exit(1)
        }
    }()
    
    routes.RegisterRoutes(r, apiKey, openAIKey)
    fmt.Printf("✅ API routes registered successfully\n")

    port := os.Getenv("PORT")
    if port == "" {
        port = "8081"
    }
    
    fmt.Printf("🚀 Starting FinSights Backend...\n")
    fmt.Printf("🔧 Port: %s\n", port)
    fmt.Printf("🔍 Health check: http://localhost:%s/health\n", port)
    fmt.Printf("📊 API endpoints: http://localhost:%s/api/\n", port)
    fmt.Printf("🌍 Environment: %s\n", os.Getenv("RAILWAY_ENVIRONMENT"))
    
    // Add a simple test endpoint that doesn't require any services
    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status": "ok", 
            "message": "FinSights API is running",
            "port": port,
            "timestamp": time.Now().Format(time.RFC3339),
        })
    })
    
    fmt.Printf("✅ Server starting on port %s...\n", port)
    
    // Bind to all interfaces (0.0.0.0) for Railway
    addr := "0.0.0.0:" + port
    fmt.Printf("🌐 Binding to: %s\n", addr)
    
    if err := r.Run(addr); err != nil {
        fmt.Printf("❌ Failed to start server: %v\n", err)
        os.Exit(1)
    }
}
