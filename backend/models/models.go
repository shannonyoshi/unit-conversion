package models

import "time"

type SuggestionInput struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	IsError bool   `json:"isError"`
}

type IngredientInput struct {
	IngredientName string `json:"ingredientName"`
	CurrentUnit    string `json:"currentUnit"`
	TargetUnit     string `json:"targetUnit"`
}

type Suggestion struct {
	ID        int
	Name      string
	Email     string
	Message   string
	IsError   bool
	CreatedAt time.Time
	ViewedAt  *time.Time
}

type Ingredient struct {
	ID    int
	Name  string
	Ratio float64
}
