package services

import (
    "encoding/json"
    "fmt"
    "net/http"

    "financeai-backend/models" // make sure this matches your module name in go.mod
)

const baseURL = "https://api.nessieisreal.com"

// GetCustomer fetches a customer by ID from Nessie
func GetCustomer(customerId string, apiKey string) (*models.Customer, error) {
    url := fmt.Sprintf("%s/customers/%s?key=%s", baseURL, customerId, apiKey)

    resp, err := http.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var customer models.Customer
    if err := json.NewDecoder(resp.Body).Decode(&customer); err != nil {
        return nil, err
    }

    return &customer, nil
}
