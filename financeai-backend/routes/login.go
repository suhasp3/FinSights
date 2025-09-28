package routes

import (
	"net/http"

	"financeai-backend/services"

	"github.com/gin-gonic/gin"
)

func RegisterLoginRoutes(rg *gin.RouterGroup) {
	mockService := services.NewMockDataService()

	rg.POST("/login", func(c *gin.Context) {
		var body struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.BindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// Validate credentials against mock data
		customer, err := mockService.GetCustomerByCredentials(body.Username, body.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Username or password not found, try again"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"username":  customer.Username,
			"firstName": customer.FirstName,
			"lastName":  customer.LastName,
		})
	})
}
