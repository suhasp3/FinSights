package main

import (
    "fmt"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"

    "financeai-backend/routes"
)

func main() {
    // load .env
    godotenv.Load()
    apiKey := os.Getenv("NESSIE_KEY")
    if apiKey == "" {
        // Use the provided API key as fallback
        apiKey = "4916cbea7b4b63696c1182758c20811f"
        fmt.Println("⚠️ Using fallback Nessie API key")
    } else {
        fmt.Println("✅ Using Nessie API key from environment")
    }

    r := gin.Default()

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
    routes.RegisterRoutes(r, apiKey)

    fmt.Println("🚀 Backend running on http://localhost:8081")
    r.Run(":8081")
}
