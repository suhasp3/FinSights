package services

import (
	"fmt"
	"math"
	"financeai-backend/models"
)

type OpenAIService struct {
	APIKey string
}

func NewOpenAIService(apiKey string) *OpenAIService {
	return &OpenAIService{
		APIKey: apiKey,
	}
}

func (ai *OpenAIService) GenerateInsights(transactions []models.Transaction, monthlySpending float64) ([]models.SpendingInsight, error) {
	// For now, let's use the fallback insights to ensure it works
	// TODO: Implement OpenAI API call later
	spendingByCategory := make(map[string]float64)
	totalSpent := 0.0
	
	for _, txn := range transactions {
		if txn.Amount < 0 { // Only count expenses
			spendingByCategory[txn.Merchant.Category] += math.Abs(txn.Amount)
			totalSpent += math.Abs(txn.Amount)
		}
	}

	// Create realistic insights based on spending data
	insights := ai.createFallbackInsights(spendingByCategory, totalSpent)
	return insights, nil
}

func (ai *OpenAIService) createFallbackInsights(spendingByCategory map[string]float64, totalSpent float64) []models.SpendingInsight {
	insights := []models.SpendingInsight{}

	// Food spending insight
	if foodSpent, exists := spendingByCategory["Food & Dining"]; exists && foodSpent > 0 {
		insights = append(insights, models.SpendingInsight{
			Title:       "Food Spending Alert",
			Description: fmt.Sprintf("You've spent $%.2f on food this month. Consider cooking more meals at home or using your campus dining plan.", foodSpent),
			Category:    "Food & Dining",
			Amount:      fmt.Sprintf("$%.2f", foodSpent),
			Tip:         "Try meal prepping on Sundays to save money and time during the week.",
		})
	}

	// Transportation insight
	if transportSpent, exists := spendingByCategory["Transportation"]; exists && transportSpent > 0 {
		insights = append(insights, models.SpendingInsight{
			Title:       "Transportation Savings",
			Description: fmt.Sprintf("Your transportation costs are $%.2f this month. Consider using campus shuttles or carpooling.", transportSpent),
			Category:    "Transportation",
			Amount:      fmt.Sprintf("$%.2f", transportSpent),
			Tip:         "Look into student bus passes or bike sharing programs on campus.",
		})
	}

	// Entertainment insight
	if entertainmentSpent, exists := spendingByCategory["Entertainment"]; exists && entertainmentSpent > 0 {
		insights = append(insights, models.SpendingInsight{
			Title:       "Entertainment Budget",
			Description: fmt.Sprintf("You've spent $%.2f on entertainment. Look for free campus events and activities.", entertainmentSpent),
			Category:    "Entertainment",
			Amount:      fmt.Sprintf("$%.2f", entertainmentSpent),
			Tip:         "Check your campus calendar for free movie nights, concerts, and social events.",
		})
	}

	// General savings tip
	insights = append(insights, models.SpendingInsight{
		Title:       "Emergency Fund",
		Description: fmt.Sprintf("With your current spending of $%.2f, try to save at least $50-100 per month for emergencies.", totalSpent),
		Category:    "Savings",
		Amount:      "$50-100",
		Tip:         "Set up automatic transfers to a savings account each month, even if it's just $25.",
	})

	return insights
}
