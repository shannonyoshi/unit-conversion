package models

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4"
)

var conn *pgx.Conn

func init() {
	var err error

	pgstr := os.Getenv("PGCONN")

	if pgstr == "" {
		panic(errors.New("no pgconn provided, put PGCONN='connect string' in your environment"))
	}

	// "postgresql://user:password@localhost:5432/development"
	conn, err = pgx.Connect(context.Background(), pgstr)
	if err != nil {
		panic(err)
	}
	if err = conn.Ping(context.Background()); err != nil {
		panic(err)
	}
	fmt.Println("Connected to Database")
}
