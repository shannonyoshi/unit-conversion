package models

import "time"

// SuggestionInput for incoming suggestions
type SuggestionInput struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	IsError bool   `json:"isError"`
}

// Suggestion for output of suggestions table queries
type Suggestion struct {
	ID        int        `json:"id"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	Message   string     `json:"message"`
	IsError   bool       `json:"is_error"`
	CreatedAt time.Time  `json:"created_at"`
	ViewedAt  *time.Time `json:"viewed_at"`
}

// IngredientInput for receiving ingredients from users
type IngredientInput struct {
	Name          string  `json:"ingredientName"`
	CurrentAmount float64 `json:"currentAmount"`
	CurrentUnit   string  `json:"currentUnit"`
	AltUnit       string  `json:"altUnit"`
	AltAmount     float64 `json:"altAmount"`
	TargetUnit    string  `json:"targetUnit"`
	TargetConv    float64 `json:"targetConv"`
}

// Ingredient for ingredients table entries
type Ingredient struct {
	ID        int
	Name      string
	GramPerML float64
}

// IngredientInfo for receiving info from API calls to third party service
type IngredientInfo struct {
	SourceAmount float64 `json:"sourceAmount"`
	SourceUnit   string  `json:"sourceUnit"`
	TargetAmount float64 `json:"targetAmount"`
	TargetUnit   string  `json:"targetUnit"`
}
