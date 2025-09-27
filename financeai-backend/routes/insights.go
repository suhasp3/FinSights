package routes

import (
    "encoding/json"
    "fmt"
    "net/http"

    "github.com/gin-gonic/gin"
)

const transactionsURL = baseURL + "/accounts/%s/purchases?key=%s"

// RegisterInsightRoutes sets up /api/insights
func RegisterInsightRoutes(rg *gin.RouterGroup, apiKey string) {
    rg.GET("/insights", func(c *gin.Context) {
        accountId := c.Query("accountId")
        if accountId == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "accountId required"})
            return
        }

        // Fetch purchases for this account
        url := fmt.Sprintf(transactionsURL, accountId, apiKey)
        resp, err := http.Get(url)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call Nessie"})
            return
        }
        defer resp.Body.Close()

        var transactions []map[string]interface{}
        if err := json.NewDecoder(resp.Body).Decode(&transactions); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Nessie response"})
            return
        }

        // TODO: replace with real analytics
        insights := []map[string]string{
            {
                "id":      "1",
                "message": "Dining spend up 22% this month",
                "trend":   "negative",
            },
            {
                "id":      "2",
                "message": "Shopping spend down 10%",
                "trend":   "positive",
            },
            {
                "id":      "3",
                "message": "Budget 85% complete with 5 days left",
                "trend":   "neutral",
            },
        }

        c.JSON(http.StatusOK, gin.H{
            "accountId":   accountId,
            "transactions": transactions, // raw data if frontend wants to use it
            "insights":    insights,      // summary insights
        })
    })
}
