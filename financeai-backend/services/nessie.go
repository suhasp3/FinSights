package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"financeai-backend/models"
)

// NessieService handles all interactions with the Nessie API
type NessieService struct {
	APIKey  string
	BaseURL string
	Client  *http.Client
}

// NewNessieService creates a new Nessie service instance
func NewNessieService(apiKey string) *NessieService {
	return &NessieService{
		APIKey:  apiKey,
		BaseURL: "http://api.nessieisreal.com",
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// GetCustomer fetches customer information by ID
func (n *NessieService) GetCustomer(customerID string) (*models.Customer, error) {
	url := fmt.Sprintf("%s/enterprise/customers/%s?key=%s", n.BaseURL, customerID, n.APIKey)
	
	resp, err := n.Client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch customer: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var customer models.Customer
	if err := json.Unmarshal(body, &customer); err != nil {
		return nil, fmt.Errorf("failed to unmarshal customer data: %v", err)
	}

	return &customer, nil
}

// GetCustomerAccounts fetches all accounts for a customer
func (n *NessieService) GetCustomerAccounts(customerID string) ([]models.Account, error) {
	url := fmt.Sprintf("%s/enterprise/customers/%s/accounts?key=%s", n.BaseURL, customerID, n.APIKey)
	
	resp, err := n.Client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch accounts: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var nessieResp models.NessieResponse
	if err := json.Unmarshal(body, &nessieResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal accounts response: %v", err)
	}

	// Convert results to Account slice
	var accounts []models.Account
	for _, result := range nessieResp.Results {
		accountBytes, err := json.Marshal(result)
		if err != nil {
			continue
		}
		
		var account models.Account
		if err := json.Unmarshal(accountBytes, &account); err != nil {
			continue
		}
		
		accounts = append(accounts, account)
	}

	return accounts, nil
}

// GetAccountTransactions fetches transactions for a specific account
func (n *NessieService) GetAccountTransactions(accountID string) ([]models.Transaction, error) {
	url := fmt.Sprintf("%s/enterprise/accounts/%s/transactions?key=%s", n.BaseURL, accountID, n.APIKey)
	
	resp, err := n.Client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch transactions: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var nessieResp models.NessieResponse
	if err := json.Unmarshal(body, &nessieResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal transactions response: %v", err)
	}

	// Convert results to Transaction slice
	var transactions []models.Transaction
	for _, result := range nessieResp.Results {
		transactionBytes, err := json.Marshal(result)
		if err != nil {
			continue
		}
		
		var transaction models.Transaction
		if err := json.Unmarshal(transactionBytes, &transaction); err != nil {
			continue
		}
		
		transactions = append(transactions, transaction)
	}

	return transactions, nil
}

// GetAllCustomerTransactions fetches all transactions for all customer accounts
func (n *NessieService) GetAllCustomerTransactions(customerID string) ([]models.Transaction, error) {
	// First get all accounts
	accounts, err := n.GetCustomerAccounts(customerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get customer accounts: %v", err)
	}

	var allTransactions []models.Transaction

	// Fetch transactions for each account
	for _, account := range accounts {
		transactions, err := n.GetAccountTransactions(account.ID)
		if err != nil {
			// Log error but continue with other accounts
			fmt.Printf("Warning: failed to get transactions for account %s: %v\n", account.ID, err)
			continue
		}
		
		allTransactions = append(allTransactions, transactions...)
	}

	return allTransactions, nil
}

// GetDashboardData aggregates all data needed for the dashboard
func (n *NessieService) GetDashboardData(customerID string) (*models.DashboardData, error) {
	// Fetch customer info
	customer, err := n.GetCustomer(customerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get customer: %v", err)
	}

	// Fetch accounts
	accounts, err := n.GetCustomerAccounts(customerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get accounts: %v", err)
	}

	// Fetch all transactions
	transactions, err := n.GetAllCustomerTransactions(customerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get transactions: %v", err)
	}

	// Process spending data
	spendingData := n.processSpendingData(transactions)

	return &models.DashboardData{
		Customer:     *customer,
		Accounts:     accounts,
		Transactions: transactions,
		SpendingData: spendingData,
	}, nil
}

// processSpendingData processes transactions to create spending analytics
func (n *NessieService) processSpendingData(transactions []models.Transaction) models.SpendingData {
	// Group transactions by month
	monthlySpending := make(map[string]float64)
	categorySpending := make(map[string]float64)
	
	// Category colors for consistent display
	categoryColors := map[string]string{
		"Food & Dining":     "hsl(var(--chart-food))",
		"Transportation":    "hsl(var(--chart-transport))",
		"Shopping":         "hsl(var(--chart-shopping))",
		"Entertainment":    "hsl(var(--chart-entertainment))",
		"Healthcare":       "hsl(var(--chart-healthcare))",
		"Utilities":        "hsl(var(--chart-utilities))",
		"Other":           "hsl(var(--chart-other))",
	}

	// Process each transaction
	for _, transaction := range transactions {
		// Only process debit transactions (spending)
		if transaction.Type == "deposit" || transaction.Amount < 0 {
			// Get month from transaction date
			month := transaction.TransactionDate.Format("Jan")
			monthlySpending[month] += transaction.Amount
			
			// Categorize transaction (simplified categorization)
			category := n.categorizeTransaction(transaction)
			categorySpending[category] += transaction.Amount
		}
	}

	// Convert to required format
	var monthlySpendingList []models.MonthlySpending
	for month, amount := range monthlySpending {
		monthlySpendingList = append(monthlySpendingList, models.MonthlySpending{
			Month:  month,
			Amount: amount,
		})
	}

	var categorySpendingList []models.CategorySpending
	for category, amount := range categorySpending {
		color, exists := categoryColors[category]
		if !exists {
			color = "hsl(var(--chart-other))"
		}
		
		categorySpendingList = append(categorySpendingList, models.CategorySpending{
			Category: category,
			Amount:   amount,
			Color:    color,
		})
	}

	// Calculate total monthly spending
	var totalMonthlySpend float64
	for _, spending := range monthlySpendingList {
		totalMonthlySpend += spending.Amount
	}

	return models.SpendingData{
		MonthlySpending:   monthlySpendingList,
		CategorySpending:  categorySpendingList,
		TotalMonthlySpend: totalMonthlySpend,
	}
}

// categorizeTransaction provides basic transaction categorization
func (n *NessieService) categorizeTransaction(transaction models.Transaction) string {
	description := transaction.Description
	merchant := transaction.Merchant.Name
	
	// Simple keyword-based categorization
	// This is where OpenAI integration would be much more powerful
	
	keywords := map[string]string{
		"restaurant": "Food & Dining",
		"food":       "Food & Dining",
		"dining":     "Food & Dining",
		"coffee":     "Food & Dining",
		"starbucks":  "Food & Dining",
		"mcdonalds":  "Food & Dining",
		"uber":       "Transportation",
		"lyft":       "Transportation",
		"gas":        "Transportation",
		"fuel":       "Transportation",
		"amazon":     "Shopping",
		"target":     "Shopping",
		"walmart":    "Shopping",
		"netflix":    "Entertainment",
		"spotify":    "Entertainment",
		"movie":      "Entertainment",
		"hospital":   "Healthcare",
		"doctor":     "Healthcare",
		"pharmacy":   "Healthcare",
		"electric":   "Utilities",
		"water":      "Utilities",
		"internet":   "Utilities",
	}

	// Check description and merchant name for keywords
	searchText := fmt.Sprintf("%s %s", description, merchant)
	
	for keyword, category := range keywords {
		if contains(searchText, keyword) {
			return category
		}
	}

	return "Other"
}

// contains checks if a string contains a substring (case-insensitive)
func contains(s, substr string) bool {
	return len(s) >= len(substr) && 
		   (s == substr || 
		    (len(s) > len(substr) && 
		     (s[:len(substr)] == substr || 
		      s[len(s)-len(substr):] == substr || 
		      contains(s[1:], substr))))
}
