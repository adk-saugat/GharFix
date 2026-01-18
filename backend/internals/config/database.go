package config

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func InitializeDatabase(){
	CONN_STRING := os.Getenv("POSTGRES_URI")
	
	// load database
	var err error
	Pool, err = pgxpool.New(context.Background(), CONN_STRING)
	if err != nil {
		log.Fatalf("Could not load database.\n Error: %v", err)
	}

	// check database connection
	if err := Pool.Ping(context.Background()); err != nil {
		log.Fatalf("Could not connect to database.\n Error: %v", err)
	}
}

func Close() {
	if Pool != nil {
		Pool.Close()
	}
}
	