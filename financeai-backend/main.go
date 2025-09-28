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
    routes.RegisterRoutes(r, apiKey, openAIKey)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8081"
    }
    
    fmt.Printf("🚀 Backend running on port %s\n", port)
    r.Run(":" + port)
}
