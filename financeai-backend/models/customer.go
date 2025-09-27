package models

type Customer struct {
    ID        string   `json:"_id"`
    FirstName string   `json:"first_name"`
    LastName  string   `json:"last_name"`
    AccountIDs []string `json:"account_ids"`
    Address   Address  `json:"address"`
}

type Address struct {
    StreetName   string `json:"street_name"`
    StreetNumber string `json:"street_number"`
    City         string `json:"city"`
    State        string `json:"state"`
    Zip          string `json:"zip"`
}
