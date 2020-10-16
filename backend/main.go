package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/jackc/pgx/v4"

	"github.com/shannonyoshi/unit-conversion/backend/models"

	"github.com/rs/cors"
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

	// var id int
	_, err = models.AddSuggestion(suggestion)
	if err != nil {
		fmt.Println("err: ", err)
	}
	// fmt.Printf(id, suggestion)
	fmt.Fprintln(w, suggestion)
}

func conversionPage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}
	decoder := json.NewDecoder(r.Body)
	var ingrInput models.IngredientInput
	err := decoder.Decode(&ingrInput)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")

	fmt.Printf("\n\nInput ingrInput: %+v\n", ingrInput)
	record, err := models.GetIngredient(ingrInput.Name)

	if err != nil {
		if err == pgx.ErrNoRows {
			fmt.Printf("ErrNoRows \n")
			APIIngredient, err := models.RequestAPIInfo(ingrInput)
			if err != nil {
				fmt.Printf("ERROR, %v\n", err)
				return
			}
			newIngr := models.ConvertToRatio(ingrInput, APIIngredient)

			_, err = models.AddIngredient(newIngr)
			if err != nil {
				fmt.Printf("ERROR, %v\n", err)
			}
			fmt.Printf("APIIngredient: %+v\n", APIIngredient)
			err = json.NewEncoder(w).Encode(APIIngredient)
			if err != nil {
				fmt.Printf("ERROR, %v\n", err)
			}

		} else {
			fmt.Println(err)
		}
	}
	target := models.Convert(ingrInput, record)

	fmt.Printf("Record: %+v\n", record)
	fmt.Printf("targetAmount: %+v\n", target)
	err = json.NewEncoder(w).Encode(target)
	if err != nil {
		fmt.Printf("ERROR, %v\n", err)
	}
}

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
