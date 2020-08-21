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

// GetIngredient returns error when no record is found
func GetIngredient(iName string) (Ingredient, error) {
	record := Ingredient{}
	if len(iName) == 0 {
		return record, errors.New("400. Ingredient name missing. Bad Request")
	}
	row := conn.QueryRow(context.Background(), "SELECT id, name, ratio FROM ingredients WHERE name=$1", iName)
	err := row.Scan(&record.ID, &record.Name, &record.Ratio)
	return record, err
}

// AddIngredient inserts a new record into the ingredients table
func AddIngredient(ingr Ingredient) (int, error) {
	if len(ingr.Name) == 0 {
		return 0, errors.New("400.Bad request. Missing ingredient name")
	}
	row := conn.QueryRow(context.Background(), "INSERT INTO ingredients (name, ratio) VALUES ($1, $2) RETURNING id", ingr.Name, ingr.Ratio)
	var id int
	err := row.Scan(&id)
	if err != nil {
		return id, errors.New("500. Internal Server Error" + err.Error())
	}
	return id, nil
}
