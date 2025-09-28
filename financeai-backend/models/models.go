package models

import "time"

// Customer represents a customer from Nessie API
type Customer struct {
	ID          string `json:"_id"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Address     Address `json:"address"`
	CreatedDate time.Time `json:"created_date"`
}

// Address represents customer address
type Address struct {
	StreetNumber string `json:"street_number"`
	StreetName   string `json:"street_name"`
	City         string `json:"city"`
	State        string `json:"state"`
	Zip          string `json:"zip"`
}

// Account represents a bank account from Nessie API
type Account struct {
	ID           string  `json:"_id"`
	Type         string  `json:"type"`
	Nickname     string  `json:"nickname"`
	Rewards      int     `json:"rewards"`
	Balance      int     `json:"balance"`
	AccountNumber string `json:"account_number"`
	CustomerID   string  `json:"customer_id"`
}

// Transaction represents a transaction from Nessie API
type Transaction struct {
	ID          string    `json:"_id"`
	Type        string    `json:"type"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	TransactionDate time.Time `json:"transaction_date"`
	Status      string    `json:"status"`
	AccountID   string    `json:"account_id"`
	MerchantID  string    `json:"merchant_id,omitempty"`
	Merchant    Merchant  `json:"merchant,omitempty"`
}

// Merchant represents merchant information
type Merchant struct {
	ID   string `json:"_id"`
	Name string `json:"name"`
	Category string `json:"category,omitempty"`
}

// DashboardData aggregates all data needed for the dashboard
type DashboardData struct {
	Customer     Customer     `json:"customer"`
	Accounts     []Account    `json:"accounts"`
	Transactions []Transaction `json:"transactions"`
	SpendingData SpendingData `json:"spending_data"`
}

// SpendingData represents processed spending information
type SpendingData struct {
	MonthlySpending     []MonthlySpending     `json:"monthly_spending"`
	DailySpending       []DailySpending       `json:"daily_spending"`
	CategorySpending    []CategorySpending    `json:"category_spending"`
	RecentTransactions  []RecentTransaction     `json:"recent_transactions"`
	TotalMonthlySpend   float64               `json:"total_monthly_spend"`
}

// MonthlySpending represents spending by month
type MonthlySpending struct {
	Month  string  `json:"month"`
	Amount float64 `json:"amount"`
}

// CategorySpending represents spending by category
type CategorySpending struct {
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Color    string  `json:"color"`
}

// DailySpending represents spending by day
type DailySpending struct {
	Day    string  `json:"day"`
	Amount float64 `json:"amount"`
}

// RecentTransaction represents a recent transaction for display
type RecentTransaction struct {
	ID          string    `json:"id"`
	Description string    `json:"description"`
	Amount      float64   `json:"amount"`
	Date        time.Time `json:"date"`
	Category    string    `json:"category"`
	Merchant    string    `json:"merchant"`
}

// SpendingInsight represents AI-generated financial insights
type SpendingInsight struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Amount      string `json:"amount"`
	Tip         string `json:"tip"`
}

// NessieResponse represents the standard Nessie API response format
type NessieResponse struct {
	Results []interface{} `json:"results"`
	Total   int           `json:"total"`
}
