package services

import (
	"fmt"
	"financeai-backend/models"
	"math/rand"
	"time"
)

// MockDataService provides realistic mock financial data
type MockDataService struct {
	customers map[string]*models.DashboardData
}

// NewMockDataService creates a new mock data service
func NewMockDataService() *MockDataService {
	service := &MockDataService{
		customers: make(map[string]*models.DashboardData),
	}
	service.initializeMockData()
	return service
}

// initializeMockData creates realistic mock data for demo customers
func (m *MockDataService) initializeMockData() {
	// Demo Customer 1: Young Professional
	m.customers["demo1"] = &models.DashboardData{
		Customer: models.Customer{
			ID:        "demo1",
			FirstName: "Sarah",
			LastName:  "Johnson",
			Address: models.Address{
				StreetNumber: "123",
				StreetName:   "Main St",
				City:         "San Francisco",
				State:        "CA",
				Zip:          "94102",
			},
			CreatedDate: time.Now().AddDate(-2, 0, 0),
		},
		Accounts: []models.Account{
			{
				ID:           "acc1",
				Type:         "Checking",
				Nickname:     "Primary Checking",
				Rewards:      1250,
				Balance:      3500,
				AccountNumber: "****1234",
				CustomerID: "demo1",
			},
			{
				ID:           "acc2",
				Type:         "Savings",
				Nickname:     "Emergency Fund",
				Rewards:      0,
				Balance:      8500,
				AccountNumber: "****5678",
				CustomerID:   "demo1",
			},
		},
		Transactions: m.generateTransactions("demo1"),
		SpendingData: models.SpendingData{
			MonthlySpending: []models.MonthlySpending{
				{Month: "Jan", Amount: 3200},
				{Month: "Feb", Amount: 2800},
				{Month: "Mar", Amount: 3500},
				{Month: "Apr", Amount: 2900},
				{Month: "May", Amount: 3300},
				{Month: "Jun", Amount: 2600},
				{Month: "Jul", Amount: 3800},
				{Month: "Aug", Amount: 3100},
				{Month: "Sep", Amount: 2700},
				{Month: "Oct", Amount: 3400},
				{Month: "Nov", Amount: 2900},
				{Month: "Dec", Amount: 3600},
			},
			CategorySpending: []models.CategorySpending{
				{Category: "Food & Dining", Amount: 1200, Color: "hsl(var(--chart-food))"},
				{Category: "Transportation", Amount: 800, Color: "hsl(var(--chart-transport))"},
				{Category: "Shopping", Amount: 650, Color: "hsl(var(--chart-shopping))"},
				{Category: "Entertainment", Amount: 400, Color: "hsl(var(--chart-entertainment))"},
				{Category: "Healthcare", Amount: 300, Color: "hsl(var(--chart-healthcare))"},
				{Category: "Other", Amount: 350, Color: "hsl(var(--chart-other))"},
			},
			TotalMonthlySpend: 3400,
		},
	}

	// Demo Customer 2: Family with Kids
	m.customers["demo2"] = &models.DashboardData{
		Customer: models.Customer{
			ID:        "demo2",
			FirstName: "Michael",
			LastName:  "Chen",
			Address: models.Address{
				StreetNumber: "456",
				StreetName:   "Oak Avenue",
				City:         "Austin",
				State:        "TX",
				Zip:          "78701",
			},
			CreatedDate: time.Now().AddDate(-5, 0, 0),
		},
		Accounts: []models.Account{
			{
				ID:           "acc3",
				Type:         "Checking",
				Nickname:     "Family Checking",
				Rewards:      2100,
				Balance:      5200,
				AccountNumber: "****9012",
				CustomerID:   "demo2",
			},
			{
				ID:           "acc4",
				Type:         "Savings",
				Nickname:     "Kids College Fund",
				Rewards:      0,
				Balance:      15000,
				AccountNumber: "****3456",
				CustomerID:   "demo2",
			},
			{
				ID:           "acc5",
				Type:         "Credit Card",
				Nickname:     "Family Rewards Card",
				Rewards:      3500,
				Balance:      -1200,
				AccountNumber: "****7890",
				CustomerID:   "demo2",
			},
		},
		Transactions: m.generateTransactions("demo2"),
		SpendingData: models.SpendingData{
			MonthlySpending: []models.MonthlySpending{
				{Month: "Jan", Amount: 5200},
				{Month: "Feb", Amount: 4800},
				{Month: "Mar", Amount: 5500},
				{Month: "Apr", Amount: 5100},
				{Month: "May", Amount: 5300},
				{Month: "Jun", Amount: 4600},
				{Month: "Jul", Amount: 5800},
				{Month: "Aug", Amount: 5200},
				{Month: "Sep", Amount: 4900},
				{Month: "Oct", Amount: 5400},
				{Month: "Nov", Amount: 5100},
				{Month: "Dec", Amount: 5600},
			},
			CategorySpending: []models.CategorySpending{
				{Category: "Food & Dining", Amount: 1800, Color: "hsl(var(--chart-food))"},
				{Category: "Transportation", Amount: 1200, Color: "hsl(var(--chart-transport))"},
				{Category: "Shopping", Amount: 900, Color: "hsl(var(--chart-shopping))"},
				{Category: "Entertainment", Amount: 600, Color: "hsl(var(--chart-entertainment))"},
				{Category: "Healthcare", Amount: 800, Color: "hsl(var(--chart-healthcare))"},
				{Category: "Other", Amount: 500, Color: "hsl(var(--chart-other))"},
			},
			TotalMonthlySpend: 5200,
		},
	}

	// Demo Customer 3: Retiree
	m.customers["demo3"] = &models.DashboardData{
		Customer: models.Customer{
			ID:        "demo3",
			FirstName: "Robert",
			LastName:  "Williams",
			Address: models.Address{
				StreetNumber: "789",
				StreetName:   "Pine Street",
				City:         "Miami",
				State:        "FL",
				Zip:          "33101",
			},
			CreatedDate: time.Now().AddDate(-10, 0, 0),
		},
		Accounts: []models.Account{
			{
				ID:           "acc6",
				Type:         "Checking",
				Nickname:     "Retirement Checking",
				Rewards:      500,
				Balance:      2800,
				AccountNumber: "****2468",
				CustomerID:   "demo3",
			},
			{
				ID:           "acc7",
				Type:         "Savings",
				Nickname:     "Travel Fund",
				Rewards:      0,
				Balance:      25000,
				AccountNumber: "****1357",
				CustomerID:   "demo3",
			},
		},
		Transactions: m.generateTransactions("demo3"),
		SpendingData: models.SpendingData{
			MonthlySpending: []models.MonthlySpending{
				{Month: "Jan", Amount: 1800},
				{Month: "Feb", Amount: 1600},
				{Month: "Mar", Amount: 1900},
				{Month: "Apr", Amount: 1700},
				{Month: "May", Amount: 1850},
				{Month: "Jun", Amount: 1500},
				{Month: "Jul", Amount: 2000},
				{Month: "Aug", Amount: 1750},
				{Month: "Sep", Amount: 1650},
				{Month: "Oct", Amount: 1800},
				{Month: "Nov", Amount: 1700},
				{Month: "Dec", Amount: 1950},
			},
			CategorySpending: []models.CategorySpending{
				{Category: "Food & Dining", Amount: 600, Color: "hsl(var(--chart-food))"},
				{Category: "Transportation", Amount: 400, Color: "hsl(var(--chart-transport))"},
				{Category: "Shopping", Amount: 300, Color: "hsl(var(--chart-shopping))"},
				{Category: "Entertainment", Amount: 200, Color: "hsl(var(--chart-entertainment))"},
				{Category: "Healthcare", Amount: 500, Color: "hsl(var(--chart-healthcare))"},
				{Category: "Other", Amount: 200, Color: "hsl(var(--chart-other))"},
			},
			TotalMonthlySpend: 1800,
		},
	}

	// Demo Customer 4: Student
	m.customers["demo4"] = &models.DashboardData{
		Customer: models.Customer{
			ID:        "demo4",
			FirstName: "Emma",
			LastName:  "Davis",
			Address: models.Address{
				StreetNumber: "321",
				StreetName:   "University Blvd",
				City:         "Boston",
				State:        "MA",
				Zip:          "02115",
			},
			CreatedDate: time.Now().AddDate(-1, 0, 0),
		},
		Accounts: []models.Account{
			{
				ID:           "acc8",
				Type:         "Checking",
				Nickname:     "Student Checking",
				Rewards:      200,
				Balance:      450,
				AccountNumber: "****3691",
				CustomerID:   "demo4",
			},
		},
		Transactions: m.generateTransactions("demo4"),
		SpendingData: models.SpendingData{
			MonthlySpending: []models.MonthlySpending{
				{Month: "Jan", Amount: 800},
				{Month: "Feb", Amount: 750},
				{Month: "Mar", Amount: 900},
				{Month: "Apr", Amount: 700},
				{Month: "May", Amount: 850},
				{Month: "Jun", Amount: 600},
				{Month: "Jul", Amount: 950},
				{Month: "Aug", Amount: 800},
				{Month: "Sep", Amount: 750},
				{Month: "Oct", Amount: 850},
				{Month: "Nov", Amount: 800},
				{Month: "Dec", Amount: 900},
			},
			CategorySpending: []models.CategorySpending{
				{Category: "Food & Dining", Amount: 400, Color: "hsl(var(--chart-food))"},
				{Category: "Transportation", Amount: 200, Color: "hsl(var(--chart-transport))"},
				{Category: "Shopping", Amount: 150, Color: "hsl(var(--chart-shopping))"},
				{Category: "Entertainment", Amount: 100, Color: "hsl(var(--chart-entertainment))"},
				{Category: "Healthcare", Amount: 50, Color: "hsl(var(--chart-healthcare))"},
				{Category: "Other", Amount: 100, Color: "hsl(var(--chart-other))"},
			},
			TotalMonthlySpend: 800,
		},
	}
}

// generateTransactions creates realistic transaction data
func (m *MockDataService) generateTransactions(customerID string) []models.Transaction {
	transactions := []models.Transaction{
		{
			ID:              "txn1",
			Type:            "deposit",
			Amount:          -45.50,
			Description:     "Starbucks Coffee",
			TransactionDate: time.Now().AddDate(0, 0, -1),
			Status:          "completed",
			AccountID:       "acc1",
			Merchant: models.Merchant{
				ID:       "merchant1",
				Name:     "Starbucks",
				Category: "Food & Dining",
			},
		},
		{
			ID:              "txn2",
			Type:            "deposit",
			Amount:          -120.00,
			Description:     "Uber Rides",
			TransactionDate: time.Now().AddDate(0, 0, -2),
			Status:          "completed",
			AccountID:       "acc1",
			Merchant: models.Merchant{
				ID:       "merchant2",
				Name:     "Uber",
				Category: "Transportation",
			},
		},
		{
			ID:              "txn3",
			Type:            "deposit",
			Amount:          -89.99,
			Description:     "Amazon Purchase",
			TransactionDate: time.Now().AddDate(0, 0, -3),
			Status:          "completed",
			AccountID:       "acc1",
			Merchant: models.Merchant{
				ID:       "merchant3",
				Name:     "Amazon",
				Category: "Shopping",
			},
		},
		{
			ID:              "txn4",
			Type:            "deposit",
			Amount:          -15.99,
			Description:     "Netflix Subscription",
			TransactionDate: time.Now().AddDate(0, 0, -5),
			Status:          "completed",
			AccountID:       "acc1",
			Merchant: models.Merchant{
				ID:       "merchant4",
				Name:     "Netflix",
				Category: "Entertainment",
			},
		},
		{
			ID:              "txn5",
			Type:            "deposit",
			Amount:          -250.00,
			Description:     "Grocery Store",
			TransactionDate: time.Now().AddDate(0, 0, -7),
			Status:          "completed",
			AccountID:       "acc1",
			Merchant: models.Merchant{
				ID:       "merchant5",
				Name:     "Whole Foods",
				Category: "Food & Dining",
			},
		},
	}

	// Add some randomness to make it more realistic
	rand.Seed(time.Now().UnixNano())
	for i := range transactions {
		// Randomize amounts slightly
		transactions[i].Amount = transactions[i].Amount * (0.8 + rand.Float64()*0.4)
		// Randomize dates
		transactions[i].TransactionDate = time.Now().AddDate(0, 0, -rand.Intn(30))
	}

	return transactions
}

// GetDashboardData returns mock dashboard data for a customer
func (m *MockDataService) GetDashboardData(customerID string) (*models.DashboardData, error) {
	if data, exists := m.customers[customerID]; exists {
		return data, nil
	}
	return nil, fmt.Errorf("customer not found: %s", customerID)
}

// GetCustomer returns mock customer data
func (m *MockDataService) GetCustomer(customerID string) (*models.Customer, error) {
	if data, exists := m.customers[customerID]; exists {
		return &data.Customer, nil
	}
	return nil, fmt.Errorf("customer not found: %s", customerID)
}

// GetCustomerAccounts returns mock account data
func (m *MockDataService) GetCustomerAccounts(customerID string) ([]models.Account, error) {
	if data, exists := m.customers[customerID]; exists {
		return data.Accounts, nil
	}
	return nil, fmt.Errorf("customer not found: %s", customerID)
}

// GetAllCustomerTransactions returns mock transaction data
func (m *MockDataService) GetAllCustomerTransactions(customerID string) ([]models.Transaction, error) {
	if data, exists := m.customers[customerID]; exists {
		return data.Transactions, nil
	}
	return nil, fmt.Errorf("customer not found: %s", customerID)
}

// GetAvailableCustomers returns list of available demo customers
func (m *MockDataService) GetAvailableCustomers() []string {
	return []string{"demo1", "demo2", "demo3", "demo4"}
}
