package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

type ReqBodySug struct {
	Suggestion string `json:"suggestion"`
	Email      string `json: "email"`
	isError    bool   `json: "isError"`
}

func suggestionPage(w http.ResponseWriter, req *http.Request) {

	decoder := json.NewDecoder(req.Body)

	var suggestion ReqBodySug
	err := decoder.Decode(&suggestion)
	if err != nil {
		fmt.Println(err)
	}

	// fmt.Println(suggestion)
	fmt.Fprintln(w, suggestion)
}

type ReqBodyIngr struct {
	IngredientName string `json: "ingredientName"`
	IngredientId int `json: "ingredientId`
}

func conversionPage(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var ingredient ReqBodyIngr
	err := decoder.Decode(&ingredient)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(ingredient)
	fmt.Fprintln(w, ingredient)

}

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/api/suggestion", suggestionPage)
	mux.HandleFunc("/api/convert", conversionPage)

	c := cors.AllowAll()

	err := http.ListenAndServe(":8080", c.Handler(mux))
	if err != nil {
		fmt.Println(err)
	}

}
