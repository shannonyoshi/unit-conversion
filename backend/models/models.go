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
	ID        int
	Name      string
	Email     string
	Message   string
	IsError   bool
	CreatedAt time.Time
	ViewedAt  *time.Time
}

// IngredientInput for receiving ingredients from users
type IngredientInput struct {
	Name          string  `json:"ingredientName"`
	CurrentAmount float64 `json:"currentAmount,string"`
	CurrentUnit   string  `json:"currentUnit"`
	AltUnit       string  `json:"altUnit"`
	AltAmount     float64 `json:"altAmount,string"`
	TargetUnit    string  `json:"targetUnit"`
}

// Ingredient for ingredients table entries
type Ingredient struct {
	ID        int
	Name      string
	GramPerML float64
}

// IngredientInfo for receiving info from API calls to third party service
type IngredientInfo struct {
	SourceAmount float64 `json:"sourceAmount,omitempty"`
	SourceUnit   string  `json:"sourceUnit,omitempty"`
	TargetAmount float64 `json:"targetAmount,omitempty"`
	TargetUnit   string  `json:"targetUnit,omitempty"`
}
