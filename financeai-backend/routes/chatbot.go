package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"financeai-backend/services"
	"financeai-backend/models"
)

func RegisterChatbotRoutes(rg *gin.RouterGroup, apiKey string) {
	chatbotService := services.NewChatbotService(apiKey)
	mockService := services.NewMockDataService()

	// General chat endpoint
	rg.POST("/chat", func(c *gin.Context) {
		var request struct {
			Message   string `json:"message"`
			Username  string `json:"username"`
			History   []struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"history"`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}

		if request.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "username required"})
			return
		}

		// Get customer data
		customerData, err := mockService.GetDashboardData(request.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get customer data"})
			return
		}

		// Convert history to ChatMessage format
		conversationHistory := make([]services.ChatMessage, len(request.History))
		for i, msg := range request.History {
			conversationHistory[i] = services.ChatMessage{
				Role:    msg.Role,
				Content: msg.Content,
			}
		}

		// Generate AI response
		response, err := chatbotService.GenerateResponse(request.Message, customerData, "General financial advice", conversationHistory)
		if err != nil {
			// Fallback response if AI fails
			response = "I'm having trouble connecting to my AI assistant right now. Please try again in a moment, or feel free to ask about your spending patterns, budgeting tips, or any financial questions you have!"
		}

		c.JSON(http.StatusOK, gin.H{
			"response": response,
			"username": request.Username,
		})
	})

	// Insight details endpoint
	rg.POST("/chat/insight", func(c *gin.Context) {
		var request struct {
			Insight   models.SpendingInsight `json:"insight"`
			Username  string                  `json:"username"`
			History   []struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"history"`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}

		if request.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "username required"})
			return
		}

		// Get customer data
		customerData, err := mockService.GetDashboardData(request.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get customer data"})
			return
		}

		// Convert history to ChatMessage format
		conversationHistory := make([]services.ChatMessage, len(request.History))
		for i, msg := range request.History {
			conversationHistory[i] = services.ChatMessage{
				Role:    msg.Role,
				Content: msg.Content,
			}
		}

		// Generate detailed insight response
		response, err := chatbotService.GenerateInsightDetails(request.Insight, customerData, conversationHistory)
		if err != nil {
			// Fallback response
			response = fmt.Sprintf("Here's more about your %s insight: %s. %s", 
				request.Insight.Category, 
				request.Insight.Description, 
				request.Insight.Tip)
		}

		c.JSON(http.StatusOK, gin.H{
			"response": response,
			"insight":  request.Insight,
			"username": request.Username,
		})
	})
}
