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

func (ai *OpenAIService) GenerateInsights(transactions []models.Transaction, monthlySpending float64, budgetData map[string]float64) ([]models.SpendingInsight, error) {
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

	// Create realistic insights based on spending data and budget
	insights := ai.createFallbackInsights(spendingByCategory, totalSpent, budgetData)
	return insights, nil
}

func (ai *OpenAIService) createFallbackInsights(spendingByCategory map[string]float64, totalSpent float64, budgetData map[string]float64) []models.SpendingInsight {
	insights := []models.SpendingInsight{}

	// Helper function to get budget for a category
	getBudget := func(category string) float64 {
		switch category {
		case "Food & Dining":
			return budgetData["foodDining"]
		case "Transportation":
			return budgetData["transportation"]
		case "Entertainment":
			return budgetData["entertainment"]
		case "Shopping":
			return budgetData["shopping"]
		case "Healthcare":
			return budgetData["healthcare"]
		default:
			return 0
		}
	}

	// Food spending insight with budget analysis
	if foodSpent, exists := spendingByCategory["Food & Dining"]; exists && foodSpent > 0 {
		foodBudget := getBudget("Food & Dining")
		if foodBudget > 0 {
			overBudget := foodSpent - foodBudget
			if overBudget > 0 {
				insights = append(insights, models.SpendingInsight{
					Title:       "Food Budget Alert",
					Description: fmt.Sprintf("You're $%.2f over your food budget! You've spent $%.2f vs your $%.2f budget. Try cooking 3 more meals at home this week to save $%.2f.", overBudget, foodSpent, foodBudget, overBudget*0.3),
					Category:    "Food & Dining",
					Amount:      fmt.Sprintf("$%.2f over budget", overBudget),
					Tip:         "Meal prep 3 lunches this Sunday to save $15-20 this week. Use your campus dining plan for 2 meals daily.",
				})
			} else {
				underBudget := foodBudget - foodSpent
				insights = append(insights, models.SpendingInsight{
					Title:       "Great Food Budgeting!",
					Description: fmt.Sprintf("You're doing well with food spending! You've spent $%.2f vs your $%.2f budget, saving $%.2f.", foodSpent, foodBudget, underBudget),
					Category:    "Food & Dining",
					Amount:      fmt.Sprintf("$%.2f under budget", underBudget),
					Tip:         fmt.Sprintf("Keep up the good work! Consider putting the extra $%.2f into your emergency fund.", underBudget*0.5),
				})
			}
		} else {
			insights = append(insights, models.SpendingInsight{
				Title:       "Food Spending Alert",
				Description: fmt.Sprintf("You've spent $%.2f on food this month. Consider cooking more meals at home or using your campus dining plan.", foodSpent),
				Category:    "Food & Dining",
				Amount:      fmt.Sprintf("$%.2f", foodSpent),
				Tip:         "Try meal prepping on Sundays to save money and time during the week.",
			})
		}
	}

	// Transportation insight with budget analysis
	if transportSpent, exists := spendingByCategory["Transportation"]; exists && transportSpent > 0 {
		transportBudget := getBudget("Transportation")
		if transportBudget > 0 {
			overBudget := transportSpent - transportBudget
			if overBudget > 0 {
				insights = append(insights, models.SpendingInsight{
					Title:       "Transportation Over Budget",
					Description: fmt.Sprintf("You're $%.2f over your transportation budget! You've spent $%.2f vs your $%.2f budget. Try using campus shuttles 4 more times this month to save $%.2f.", overBudget, transportSpent, transportBudget, overBudget*0.4),
					Category:    "Transportation",
					Amount:      fmt.Sprintf("$%.2f over budget", overBudget),
					Tip:         "Use the campus shuttle 3 times this week instead of rideshare. Look into a student bus pass for $20/month.",
				})
			} else {
				underBudget := transportBudget - transportSpent
				insights = append(insights, models.SpendingInsight{
					Title:       "Smart Transportation!",
					Description: fmt.Sprintf("Great job with transportation costs! You've spent $%.2f vs your $%.2f budget, saving $%.2f.", transportSpent, transportBudget, underBudget),
					Category:    "Transportation",
					Amount:      fmt.Sprintf("$%.2f under budget", underBudget),
					Tip:         fmt.Sprintf("Keep using campus shuttles and carpooling. Consider investing the extra $%.2f in your savings.", underBudget*0.6),
				})
			}
		} else {
			insights = append(insights, models.SpendingInsight{
				Title:       "Transportation Savings",
				Description: fmt.Sprintf("Your transportation costs are $%.2f this month. Consider using campus shuttles or carpooling.", transportSpent),
				Category:    "Transportation",
				Amount:      fmt.Sprintf("$%.2f", transportSpent),
				Tip:         "Look into student bus passes or bike sharing programs on campus.",
			})
		}
	}

	// Entertainment insight with budget analysis
	if entertainmentSpent, exists := spendingByCategory["Entertainment"]; exists && entertainmentSpent > 0 {
		entertainmentBudget := getBudget("Entertainment")
		if entertainmentBudget > 0 {
			overBudget := entertainmentSpent - entertainmentBudget
			if overBudget > 0 {
				insights = append(insights, models.SpendingInsight{
					Title:       "Entertainment Over Budget",
					Description: fmt.Sprintf("You're $%.2f over your entertainment budget! You've spent $%.2f vs your $%.2f budget. Try 2 free campus events this month to save $%.2f.", overBudget, entertainmentSpent, entertainmentBudget, overBudget*0.5),
					Category:    "Entertainment",
					Amount:      fmt.Sprintf("$%.2f over budget", overBudget),
					Tip:         "Check your campus calendar for free movie nights and concerts. Host a game night at home instead of going out.",
				})
			} else {
				underBudget := entertainmentBudget - entertainmentSpent
				insights = append(insights, models.SpendingInsight{
					Title:       "Entertainment Budget Success!",
					Description: fmt.Sprintf("Excellent entertainment budgeting! You've spent $%.2f vs your $%.2f budget, saving $%.2f.", entertainmentSpent, entertainmentBudget, underBudget),
					Category:    "Entertainment",
					Amount:      fmt.Sprintf("$%.2f under budget", underBudget),
					Tip:         fmt.Sprintf("You're doing great! Consider treating yourself to one nice activity with the extra $%.2f.", underBudget*0.3),
				})
			}
		} else {
			insights = append(insights, models.SpendingInsight{
				Title:       "Entertainment Budget",
				Description: fmt.Sprintf("You've spent $%.2f on entertainment. Look for free campus events and activities.", entertainmentSpent),
				Category:    "Entertainment",
				Amount:      fmt.Sprintf("$%.2f", entertainmentSpent),
				Tip:         "Check your campus calendar for free movie nights, concerts, and social events.",
			})
		}
	}

	// Overall budget analysis
	totalBudget := budgetData["transportation"] + budgetData["foodDining"] + budgetData["healthcare"] + budgetData["entertainment"] + budgetData["shopping"]
	if totalBudget > 0 {
		overallOverBudget := totalSpent - totalBudget
		if overallOverBudget > 0 {
			insights = append(insights, models.SpendingInsight{
				Title:       "Overall Budget Alert",
				Description: fmt.Sprintf("You're $%.2f over your total monthly budget! You've spent $%.2f vs your $%.2f budget. Focus on your highest spending category to get back on track.", overallOverBudget, totalSpent, totalBudget),
				Category:    "Savings",
				Amount:      fmt.Sprintf("$%.2f over budget", overallOverBudget),
				Tip:         "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Cut back on your highest spending category by 20% next month.",
			})
		} else {
			underBudget := totalBudget - totalSpent
			insights = append(insights, models.SpendingInsight{
				Title:       "Budget Success!",
				Description: fmt.Sprintf("Congratulations! You're $%.2f under your total monthly budget! You've spent $%.2f vs your $%.2f budget.", underBudget, totalSpent, totalBudget),
				Category:    "Savings",
				Amount:      fmt.Sprintf("$%.2f under budget", underBudget),
				Tip:         fmt.Sprintf("Great job! Consider putting $%.2f into your emergency fund and $%.2f into a fun activity.", underBudget*0.7, underBudget*0.3),
			})
		}
	} else {
		// General savings tip if no budget data
		insights = append(insights, models.SpendingInsight{
			Title:       "Emergency Fund",
			Description: fmt.Sprintf("With your current spending of $%.2f, try to save at least $50-100 per month for emergencies.", totalSpent),
			Category:    "Savings",
			Amount:      "$50-100",
			Tip:         "Set up automatic transfers to a savings account each month, even if it's just $25.",
		})
	}

	return insights
}
