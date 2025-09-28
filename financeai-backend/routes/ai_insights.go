package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"financeai-backend/services"
	"financeai-backend/models"
)

func RegisterAIInsightRoutes(rg *gin.RouterGroup, apiKey string) {
	aiService := services.NewOpenAIService(apiKey)
	mockService := services.NewMockDataService()

	rg.GET("/ai-insights", func(c *gin.Context) {
		customerId := c.Query("customerId")
		if customerId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
			return
		}

		// Get customer data
		dashboardData, err := mockService.GetDashboardData(customerId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Generate AI insights
		insights, err := aiService.GenerateInsights(dashboardData.Transactions, dashboardData.SpendingData.TotalMonthlySpend)
		if err != nil {
			// Log the error for debugging
			fmt.Printf("AI Insights Error: %v\n", err)
			// If AI fails, return fallback insights
			insights = []models.SpendingInsight{
				{
					Title:       "Welcome to AI Insights!",
					Description: "AI-powered financial insights are being generated for your spending patterns.",
					Category:    "General",
					Amount:      "Coming Soon",
					Tip:         "Check back soon for personalized financial advice based on your spending habits.",
				},
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"customerId": customerId,
			"insights":   insights,
		})
	})
}
