package routes

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func RegisterLoginRoutes(rg *gin.RouterGroup) {
    rg.POST("/login", func(c *gin.Context) {
        var body struct {
            CustomerID string `json:"customerId"`
        }
        if err := c.BindJSON(&body); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
            return
        }

        // Echo it back (fake login)
        c.JSON(http.StatusOK, gin.H{"customerId": body.CustomerID})
    })
}
