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

	rg.POST("/ai-insights", func(c *gin.Context) {
		var request struct {
			CustomerId string            `json:"customerId"`
			BudgetData map[string]float64 `json:"budgetData"`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}

		if request.CustomerId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
			return
		}

		// Get customer data
		dashboardData, err := mockService.GetDashboardData(request.CustomerId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Generate AI insights with budget data
		insights, err := aiService.GenerateInsights(dashboardData.Transactions, dashboardData.SpendingData.TotalMonthlySpend, request.BudgetData)
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
			"customerId": request.CustomerId,
			"insights":   insights,
		})
	})
}
