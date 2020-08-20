package models

import (
	"context"
	"errors"
	"fmt"
)

//AddSuggestion() for suggestion post requests
func AddSuggestion(s SuggestionInput) (int, error) {
	if len(s.Message) == 0 {
		return 0, errors.New("400. Bad request. Message field can't be empty")
	}
	row := conn.QueryRow(context.Background(), "INSERT INTO suggestions(name, email, message, is_error) VALUES ($1, $2, $3, $4) RETURNING id", s.Name, s.Email, s.Message, s.IsError)

	var id int
	err := row.Scan(&id)
	if err != nil {
		return 0, errors.New("500. Internal Server Error" + err.Error())
	}
	return id, nil
}

//Below functions are not for use with regular API, just practice/to view suggestions eventually
func AllSuggestions() ([]Suggestion, error) {
	rows, err := conn.Query(context.Background(), "select id, name, email, message, is_error, created_at, viewed_at from suggestions")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var records []Suggestion
	for rows.Next() {
		var result Suggestion
		err = rows.Scan(&result.ID, &result.Name, &result.Email, &result.Message, &result.IsError, &result.CreatedAt, &result.ViewedAt)
		if err != nil {
			return nil, err
		}
		records = append(records, result)
	}
	fmt.Println(records)
	return records, nil
}

//ConfirmViewed() to mark items after I see them in suggestions
func ConfirmViewed(id int) error {
	_, err := conn.Exec(context.Background(), "UPDATE suggestions SET viewed_at = CURRENT_DATE WHERE id = $1", id)
	return err
}
