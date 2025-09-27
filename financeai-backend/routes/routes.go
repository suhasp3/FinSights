package routes

import (
    "github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, apiKey string) {
    // group API under /api
    api := r.Group("/api")
    {
        RegisterLoginRoutes(api)
        RegisterAccountRoutes(api, apiKey)
        RegisterInsightRoutes(api, apiKey)
    }
}
