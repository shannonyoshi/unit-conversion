package models

import (
	"context"
	"errors"
)

/*

funcs needed:
getIngredient
addIngredient

*/

//returns error when no record is found
func GetIngredient(iName string) (Ingredient, error) {
	record := Ingredient{}
	if len(iName) == 0 {
		return record, errors.New("400. Ingredient name missing. Bad Request")
	}
	row := conn.QueryRow(context.Background(), "SELECT id, name, ratio FROM ingredients WHERE name=$1", iName)
	err := row.Scan(&record.ID, &record.Name, &record.Ratio)
	return record, err
}
