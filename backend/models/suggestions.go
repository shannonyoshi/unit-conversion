package models

import (
	"context"
	"errors"
	"fmt"
)

//AddSuggestion for suggestion post requests
func AddSuggestion(s SuggestionInput) (Suggestion, error) {
	var fullSug Suggestion
	if len(s.Message) == 0 {
		return fullSug, errors.New("400. Bad request. Message field can't be empty")
	}
	err := conn.QueryRow(context.Background(), "INSERT INTO suggestions(name, email, message, is_error) VALUES ($1, $2, $3, $4) RETURNING *", s.Name, s.Email, s.Message, s.IsError).Scan(&fullSug.ID, &fullSug.Name, &fullSug.Email, &fullSug.Message, &fullSug.IsError, &fullSug.CreatedAt, &fullSug.ViewedAt)

	// err := row
	if err != nil {
		return fullSug, errors.New("500. Internal Server Error " + err.Error())
	}
	return fullSug, nil
}

// UpdateSuggestion to update already added suggestions by ID
func UpdateSuggestion(s Suggestion) (Suggestion, error) {
	var updated Suggestion
	if len(s.Message) == 0 {
		return updated, errors.New("400. Bad request. Message field can't be empty")
	}
	err := conn.QueryRow(context.Background(), "UPDATE suggestions SET name=$1, email=$2, message=$3, is_error=$4 WHERE id=$5 RETURNING *", s.Name, s.Email, s.Message, s.IsError, s.ID).Scan(&updated.ID, &updated.Name, &updated.Email, &updated.Message, &updated.IsError, &updated.CreatedAt, &updated.ViewedAt)
	if err != nil {
		return updated, errors.New(err.Error())
	}
	return updated, nil
}

// DeleteSuggestion to remove suggestion by ID
func DeleteSuggestion(id int) error {
	_, err := conn.Exec(context.Background(), "DELETE from suggestions WHERE id=$1", id)
	if err != nil {
		return errors.New("500. Internal Server Error " + err.Error())
	}
	return nil
}

//AllSuggestions returns all suggestions on table
func AllSuggestions() ([]Suggestion, error) {
	rows, err := conn.Query(context.Background(), "select id, name, email, message, is_error, created_at, viewed_at from suggestions")
	if err != nil {
		return nil, errors.New("500. Internal Server Error" + err.Error())
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

//ConfirmViewed to mark items after I see them in suggestions
func ConfirmViewed(id int) error {
	_, err := conn.Exec(context.Background(), "UPDATE suggestions SET viewed_at = CURRENT_DATE WHERE id = $1", id)
	return err
}
