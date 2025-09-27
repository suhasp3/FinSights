package routes

import (
    "encoding/json"
    "fmt"
    "net/http"

    "github.com/gin-gonic/gin"
)

const baseURL = "https://api.nessieisreal.com"

func RegisterAccountRoutes(rg *gin.RouterGroup, apiKey string) {
    rg.GET("/accounts", func(c *gin.Context) {
        customerId := c.Query("customerId")
        if customerId == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "customerId required"})
            return
        }

        url := fmt.Sprintf("%s/customers/%s/accounts?key=%s", baseURL, customerId, apiKey)
        fmt.Println("➡️ Fetching accounts for:", customerId)

        resp, err := http.Get(url)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call Nessie"})
            return
        }
        defer resp.Body.Close()

        var data interface{}
        if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Nessie response"})
            return
        }

        c.JSON(http.StatusOK, data)
    })
}
