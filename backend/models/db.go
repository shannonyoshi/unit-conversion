package models

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v4"
)

var conn *pgx.Conn

func init() {
	var err error

	conn, err = pgx.Connect(context.Background(), "postgresql://user:password@localhost:5432/development")
	if err != nil {
		panic(err)
	}
	if err = conn.Ping(context.Background()); err != nil {
		panic(err)
	}
	fmt.Println("Connected to Database")
}
