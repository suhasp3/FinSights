package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"financeai-backend/models"
)

type ChatbotService struct {
	APIKey string
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Model    string        `json:"model"`
	Messages []ChatMessage `json:"messages"`
	MaxTokens int         `json:"max_tokens"`
	Temperature float64   `json:"temperature"`
}

type ChatResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func NewChatbotService(apiKey string) *ChatbotService {
	return &ChatbotService{
		APIKey: apiKey,
	}
}

func (c *ChatbotService) GenerateResponse(userMessage string, customerData *models.DashboardData, context string, conversationHistory []ChatMessage) (string, error) {
	// Create system prompt with customer context
	systemPrompt := c.createSystemPrompt(customerData, context)
	
	// Prepare messages for OpenAI with conversation history
	messages := []ChatMessage{
		{Role: "system", Content: systemPrompt},
	}
	
	// Add conversation history (limit to last 10 messages to avoid token limits)
	historyLimit := 10
	if len(conversationHistory) > historyLimit {
		conversationHistory = conversationHistory[len(conversationHistory)-historyLimit:]
	}
	messages = append(messages, conversationHistory...)
	
	// Add current user message
	messages = append(messages, ChatMessage{Role: "user", Content: userMessage})

	// Create request payload
	request := ChatRequest{
		Model:       "gpt-3.5-turbo",
		Messages:    messages,
		MaxTokens:   500,
		Temperature: 0.7,
	}

	// Convert to JSON
	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %v", err)
	}

	// Make API call
	client := &http.Client{}
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.APIKey)

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	// Parse response
	var chatResp ChatResponse
	if err := json.Unmarshal(body, &chatResp); err != nil {
		return "", fmt.Errorf("failed to parse response: %v", err)
	}

	if len(chatResp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return chatResp.Choices[0].Message.Content, nil
}

func (c *ChatbotService) createSystemPrompt(customerData *models.DashboardData, context string) string {
	// Calculate spending summary
	totalSpent := customerData.SpendingData.TotalMonthlySpend
	foodSpent := 0.0
	transportSpent := 0.0
	entertainmentSpent := 0.0
	
	for _, category := range customerData.SpendingData.CategorySpending {
		switch category.Category {
		case "Food & Dining":
			foodSpent = category.Amount
		case "Transportation":
			transportSpent = category.Amount
		case "Entertainment":
			entertainmentSpent = category.Amount
		}
	}

	systemPrompt := fmt.Sprintf(`You are a helpful financial advisor AI assistant for college students. You have access to the user's financial data and can provide personalized advice.

User Information:
- Name: %s %s
- Total Monthly Spending: $%.2f
- Food & Dining: $%.2f
- Transportation: $%.2f
- Entertainment: $%.2f

Context: %s

Guidelines:
1. Be friendly, encouraging, and supportive
2. Focus on practical, actionable advice for college students
3. Suggest specific money-saving strategies
4. Use the user's actual spending data to give personalized recommendations
5. Keep responses concise but helpful
6. If asked about specific insights, provide detailed explanations with actionable tips
7. IMPORTANT: Reference previous conversation context to avoid repetition
8. If you've already discussed a topic, acknowledge it briefly and provide new insights
9. Build on previous advice rather than repeating the same information
10. Use clear, readable formatting - avoid excessive markdown formatting like **bold** text

Remember: This user is a college student, so focus on budget-friendly solutions and student-specific financial tips.`, 
		customerData.Customer.FirstName, 
		customerData.Customer.LastName,
		totalSpent,
		foodSpent,
		transportSpent,
		entertainmentSpent,
		context)

	return systemPrompt
}

func (c *ChatbotService) GenerateInsightDetails(insight models.SpendingInsight, customerData *models.DashboardData, conversationHistory []ChatMessage) (string, error) {
	context := fmt.Sprintf("The user clicked on an insight: '%s' - %s. They want to learn more about this specific financial advice.", 
		insight.Title, insight.Description)
	
	userMessage := fmt.Sprintf("Can you tell me more about this insight: %s. %s What should I do about it?", 
		insight.Title, insight.Description)
	
	return c.GenerateResponse(userMessage, customerData, context, conversationHistory)
}
