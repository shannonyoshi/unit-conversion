package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v4"

	"github.com/gorilla/handlers"
	"github.com/rs/cors"
	"github.com/shannonyoshi/unit-conversion/backend/models"
)

func suggestionPage(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	switch r.Method {
	case "POST":
		var suggestion models.SuggestionInput
		err := decoder.Decode(&suggestion)
		if err != nil {
			fmt.Println(err)
		}
		// fmt.Printf("suggestion: %+v\n", suggestion)

		result, err := models.AddSuggestion(suggestion)
		if err != nil {
			fmt.Println("err: ", err)
		}
		w.WriteHeader(http.StatusCreated)
		err = json.NewEncoder(w).Encode(result)
		if err != nil {
			fmt.Println(err)
		}
	case "PUT":
		var suggestion models.Suggestion
		err := decoder.Decode(&suggestion)
		if err != nil {
			fmt.Println(err)
		}
		// fmt.Printf("suggestion: %+v\n", suggestion)
		result, err := models.UpdateSuggestion(suggestion)
		if err != nil {
			fmt.Println("err: ", err)
		}
		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(result)
		if err != nil {
			fmt.Println(err)
		}
	case "DELETE":
		var id int
		err := decoder.Decode(&id)
		if err != nil {
			fmt.Println(err)
		}
		err = models.DeleteSuggestion(id)
		if err != nil {
			fmt.Println(err)
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
	}
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
			// convert to ratio that can be stored in DB
			newIngr := models.ConvertToRatio(ingrInput, APIIngredient)
			// adds new ingredient to DB
			_, err = models.AddIngredient(newIngr)
			if err != nil {
				fmt.Printf("ERROR, %v\n", err)
			}
			fmt.Printf("APIIngredient: %+v\n", APIIngredient)
			// convert new ingredient to return
			convertedNewIngr := models.Convert(ingrInput, newIngr)
			err = json.NewEncoder(w).Encode(convertedNewIngr)
			if err != nil {
				fmt.Printf("ERROR, %v\n", err)
			}

		} else {
			fmt.Println(err)
		}
		return
	}
	target := models.Convert(ingrInput, record)

	fmt.Printf("Record: %+v\n", record)
	fmt.Printf("targetAmount: %+v\n", target)
	err = json.NewEncoder(w).Encode(target)
	if err != nil {
		fmt.Printf("ERROR, %v\n", err)
	}
}

// viewAllSuggestions() returns all suggestion records
func viewAllSuggestions(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("viewAllSuggestions")
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}
	records, err := models.AllSuggestions()
	if err != nil {
		fmt.Fprintln(w, err)
	}
	fmt.Printf("Records: %+v\n", records)
	fmt.Fprintln(w, records)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/suggest", suggestionPage)
	mux.HandleFunc("/api/view-suggestions", viewAllSuggestions)
	mux.HandleFunc("/api/convert", conversionPage)
	fs := wrapHandler(http.FileServer(http.Dir("./static")))
	mux.Handle("/", fs)

	cors := cors.Default().Handler(mux)
	wrap := handlers.LoggingHandler(os.Stdout, cors)

	err := http.ListenAndServe(":8080", wrap)
	if err != nil {
		fmt.Println(err)
	}

}

type NotFoundRedirectRespWr struct {
	http.ResponseWriter // We embed http.ResponseWriter
	status              int
}

func (w *NotFoundRedirectRespWr) WriteHeader(status int) {
	w.status = status // Store the status for our own use
	if status != http.StatusNotFound {
		w.ResponseWriter.WriteHeader(status)
	}
}

func (w *NotFoundRedirectRespWr) Write(p []byte) (int, error) {
	if w.status != http.StatusNotFound {
		return w.ResponseWriter.Write(p)
	}
	return len(p), nil // Lie that we successfully written it
}

func wrapHandler(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		nfrw := &NotFoundRedirectRespWr{ResponseWriter: w}
		h.ServeHTTP(nfrw, r)
		if nfrw.status == 404 {
			log.Printf("Redirecting %s to index.html.", r.RequestURI)
			http.Redirect(w, r, "/index.html", http.StatusFound)
		}
	}
}
