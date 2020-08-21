package main

import (
	"encoding/json"
	"fmt"
	"net/http"
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
	record, err := models.GetIngredient(ingredient.Name)
	if err == pgx.ErrNoRows {
		//makes 3rd party API call to get ingredient information
		requestInfo(ingredient)
	}

	fmt.Println(ingredient)
	fmt.Fprintln(w, ingredient)
}

func requestInfo(input IngredientInput) {
	baseURL := "https://api.spoonacular.com/recipes/convert"
	client := &http.Client{Timeout: 100 * time.Microsecond}
	req, err := http.NewRequest("GET", baseURL, nil)
	if err != nil {
		fmt.Println(err)
	}
	q := req.URL.Query()

	q.Add("ingredientName", input.Name)
	q.Add("sourceAmount", input.CurrentAmount)
	q.Add("sourceUnit", input.CurrentUnit)
	q.Add("targetUnit", input.TargetUnit)
	q.Add("apiKey")
	req.URL.RawQuery = q.Encode()
	fmt.Println(req.URL.String())
}

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
