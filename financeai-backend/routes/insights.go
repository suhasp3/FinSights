package routes

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "financeai-backend/services"
    "financeai-backend/models"
)

// RegisterInsightRoutes sets up /api/insights
func RegisterInsightRoutes(rg *gin.RouterGroup, apiKey string) {
    mockService := services.NewMockDataService()

    rg.GET("/insights", func(c *gin.Context) {
        customerId := c.Query("customerId")
        if customerId == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
            return
        }

        // Get all transactions for the customer
        transactions, err := mockService.GetAllCustomerTransactions(customerId)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // Generate basic insights from transaction data
        insights := generateInsights(transactions)

        c.JSON(http.StatusOK, gin.H{
            "customerId":  customerId,
            "transactions": transactions,
            "insights":    insights,
        })
    })
}

// generateInsights creates basic insights from transaction data
func generateInsights(transactions []models.Transaction) []map[string]interface{} {
    // For now, return mock insights
    // In Phase 2, this will be replaced with OpenAI-powered insights
    return []map[string]interface{}{
        {
            "id":      "1",
            "title":   "Spending Analysis",
            "message": "Based on your transaction history, you've made good progress this month",
            "trend":   "positive",
            "type":    "spending",
        },
        {
            "id":      "2", 
            "title":   "Budget Tracking",
            "message": "You're on track to meet your monthly budget goals",
            "trend":   "neutral",
            "type":    "budget",
        },
        {
            "id":      "3",
            "title":   "Savings Opportunity",
            "message": "Consider setting up automatic savings transfers",
            "trend":   "positive", 
            "type":    "savings",
        },
    }
}
