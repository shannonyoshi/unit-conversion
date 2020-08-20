package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/rs/cors"

	"./models"
)

func suggestionPage(w http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}
	decoder := json.NewDecoder(req.Body)

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

func conversionPage(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var ingredient models.IngredientInput
	err := decoder.Decode(&ingredient)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(ingredient)
	fmt.Fprintln(w, ingredient)

}

func viewAllSuggestions(w http.ResponseWriter, r *http.Request) {
	records, err := models.AllSuggestions()
	if err != nil {
		fmt.Fprintln(w, err)
	}
	fmt.Fprintln(w, records)
}

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/api/suggest", suggestionPage)
	mux.HandleFunc("/api/convert", conversionPage)
	mux.HandleFunc("/api/suggest/all", viewAllSuggestions)

	c := cors.AllowAll()

	err := http.ListenAndServe(":8080", c.Handler(mux))
	if err != nil {
		fmt.Println(err)
	}

}
