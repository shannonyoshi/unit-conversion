package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx"

	"github.com/rs/cors"

	"./models"
)

func suggestionPage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}
	decoder := json.NewDecoder(r.Body)

	var suggestion models.SuggestionInput
	err := decoder.Decode(&suggestion)
	if err != nil {
		fmt.Println(err)
	}

	var id int
	id, err = models.AddSuggestion(suggestion)
	if err != nil {
		fmt.Println("err: ", err)
	}
	fmt.Println(id)
	fmt.Fprintln(w, suggestion)
}

func conversionPage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}
	decoder := json.NewDecoder(r.Body)
	var ingredient models.IngredientInput
	err := decoder.Decode(&ingredient)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("Input ingredient: %+v\n", ingredient)
	record, err := models.GetIngredient(ingredient.Name)
	if err != nil && err != pgx.ErrNoRows {
		fmt.Println(err)
	}
	//TODO: write conversion handler to put here

	// if err == pgx.ErrNoRows {
	// 	requestAPIInfo(ingredient)
	// }

	fmt.Printf("Record: %+v\n", record)
	// fmt.Fprintln(w, ingredient)
}

// requestAPIInfo gets new ingredients information from a 3rd party API
func requestAPIInfo(input models.IngredientInput) {
	baseURL := "https://api.spoonacular.com/recipes/convert"
	client := &http.Client{Timeout: 1 * time.Second}
	req, err := http.NewRequest("GET", baseURL, nil)
	if err != nil {
		fmt.Println(err)
	}

	req.Header.Set("Content-Type", "application/json")

	q := req.URL.Query()

	q.Add("ingredientName", input.Name)
	q.Add("sourceAmount", fmt.Sprintf("%f", input.CurrentAmount))
	q.Add("sourceUnit", input.CurrentUnit)
	q.Add("targetUnit", input.TargetUnit)
	q.Add("apiKey", os.Getenv("SPOONTACULAR_API_KEY"))
	req.URL.RawQuery = q.Encode()
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
	}
	decoder := json.NewDecoder(resp.Body)
	var APIIngredient models.IngredientInfo
	err = decoder.Decode(&APIIngredient)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(req.URL.String())
	fmt.Println(APIIngredient)

}

// func convert(ingr models.Ingredient) float64 {
//
// }

//viewAllSuggestions returns all suggestion records
// func viewAllSuggestions(w http.ResponseWriter, r *http.Request) {
// 	records, err := models.AllSuggestions()
// 	if err != nil {
// 		fmt.Fprintln(w, err)
// 	}
// 	fmt.Fprintln(w, records)
// }

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/suggest", suggestionPage)
	mux.HandleFunc("/api/convert", conversionPage)
	// mux.HandleFunc("/api/suggest/all", viewAllSuggestions)

	c := cors.AllowAll()

	err := http.ListenAndServe(":8080", c.Handler(mux))
	if err != nil {
		fmt.Println(err)
	}

}
