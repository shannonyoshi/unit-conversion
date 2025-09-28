package models

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"
)

/*

funcs needed:
getIngredient
addIngredient

*/

// GetIngredient returns error when no record is found
func GetIngredient(iName string) (Ingredient, error) {
	record := Ingredient{}
	if len(iName) == 0 {
		return record, errors.New("400. Ingredient name missing. Bad Request")
	}
	row := conn.QueryRow(context.Background(), "SELECT id, name, ratio FROM ingredients WHERE name=$1", iName)
	err := row.Scan(&record.ID, &record.Name, &record.GramPerML)
	return record, err
}

// AddIngredient inserts a new record into the ingredients table
func AddIngredient(ingr Ingredient) (int, error) {
	if len(ingr.Name) == 0 {
		return 0, errors.New("400.Bad request. Missing ingredient name")
	}
	row := conn.QueryRow(context.Background(), "INSERT INTO ingredients (name, ratio) VALUES ($1, $2) RETURNING id", ingr.Name, ingr.GramPerML)
	var id int
	err := row.Scan(&id)
	if err != nil {
		return id, errors.New("500. Internal Server Error" + err.Error())
	}
	return id, nil
}

// RequestAPIInfo gets new ingredients information from a 3rd party API
func RequestAPIInfo(input IngredientInput) (IngredientInfo, error) {
	baseURL := "https://api.spoonacular.com/recipes/convert"
	client := &http.Client{Timeout: 15 * time.Second}
	req, err := http.NewRequest("GET", baseURL, nil)
	var APIIngredient IngredientInfo
	if err != nil {
		fmt.Println(err)
		return APIIngredient, err
	}

	req.Header.Set("Content-Type", "application/json")

	q := req.URL.Query()

	q.Add("ingredientName", input.Name)
	q.Add("sourceAmount", fmt.Sprintf("%f", input.CurrentAmount))
	q.Add("sourceUnit", input.CurrentUnit)
	q.Add("targetUnit", input.TargetUnit)
	q.Add("apiKey", os.Getenv("SPOONACULAR_API_KEY"))
	req.URL.RawQuery = q.Encode()
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return APIIngredient, err
		 
	}
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&APIIngredient)
	// fmt.Printf("Error?: %v\n", err)
	if err != nil {
		fmt.Println(err)
		return APIIngredient, err
		
	}
	fmt.Printf("Query URL: %v\n", req.URL.String())
	fmt.Println(APIIngredient)
	fmt.Printf("API Ingredient: %+v\n", APIIngredient)
	return APIIngredient, nil
}

// ConvertToRatio takes the info returned from the API and from the client and converts it the the ratio of grams/mL to be stored
//Ratio=grams/mL
func ConvertToRatio(input IngredientInput, info IngredientInfo) Ingredient {
	var toAdd = Ingredient{Name: input.Name}

	switch input.AltUnit {
	case "mL":
		toAdd.GramPerML = info.TargetAmount * input.TargetConv / input.AltAmount
		fmt.Printf("mL toAdd GramPerML: (info.TargetAmount) %v * (input.TargetConv) %v / (input.AltAmount) %v", info.TargetAmount, input.TargetConv, input.AltAmount)
	case "g":
		toAdd.GramPerML = input.AltAmount / (info.TargetAmount * input.TargetConv)
		fmt.Printf("g toAdd GramPerML: %v", toAdd.GramPerML)

	}
	fmt.Printf("toAdd in ConvertTRatio: %+v", toAdd)
	return toAdd
}

// Convert handles the conversion for ingredients already in the Ingredients table
func Convert(input IngredientInput, ingr Ingredient) IngredientInfo {
	fmt.Printf("\n\nparameters from Convert\nIngredientInput: %+v\n Ingredient: %+v\n", input, ingr)
	var targetAmount float64
	switch input.AltUnit {
	case "mL":
		targetAmount = input.AltAmount * ingr.GramPerML / input.TargetConv
	case "g":
		targetAmount = input.AltAmount * (1 / ingr.GramPerML) / input.TargetConv
	}
	output := IngredientInfo{SourceAmount: input.CurrentAmount, SourceUnit: input.CurrentUnit, TargetAmount: targetAmount, TargetUnit: input.TargetUnit}
	fmt.Printf("TargetAmount in Convert: %+v\n", output)
	return output
}
