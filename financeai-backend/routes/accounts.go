package routes

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "financeai-backend/services"
)

func RegisterAccountRoutes(rg *gin.RouterGroup, apiKey string) {
    mockService := services.NewMockDataService()

    // Get customer accounts
    rg.GET("/accounts", func(c *gin.Context) {
        customerId := c.Query("customerId")
        if customerId == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
            return
        }

        accounts, err := mockService.GetCustomerAccounts(customerId)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{"accounts": accounts})
    })

    // Get customer info
    rg.GET("/customer", func(c *gin.Context) {
        customerId := c.Query("customerId")
        if customerId == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
            return
        }

        customer, err := mockService.GetCustomer(customerId)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, customer)
    })

    // Get all transactions for customer
    rg.GET("/transactions", func(c *gin.Context) {
        customerId := c.Query("customerId")
        if customerId == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
            return
        }

        transactions, err := mockService.GetAllCustomerTransactions(customerId)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{"transactions": transactions})
    })

    // Get complete dashboard data
    rg.GET("/dashboard", func(c *gin.Context) {
        customerId := c.Query("customerId")
        if customerId == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
            return
        }

        dashboardData, err := mockService.GetDashboardData(customerId)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, dashboardData)
    })

    // Get available demo customers
    rg.GET("/demo-customers", func(c *gin.Context) {
        customers := mockService.GetAvailableCustomers()
        c.JSON(http.StatusOK, gin.H{"customers": customers})
    })
}