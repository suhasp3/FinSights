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
        fmt.Println("⚠️ NESSIE_KEY not set")
    }

    r := gin.Default()

    // pass apiKey down to routes
    routes.RegisterRoutes(r, apiKey)

    fmt.Println("🚀 Backend running on http://localhost:8080")
    r.Run(":8080")
}
