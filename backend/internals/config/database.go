package config

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
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

func RunMigrations(migrationsDir string) {
	db := stdlib.OpenDBFromPool(Pool)

	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatal("Could not set goose dialect: ", err)
	}

	if err := goose.Up(db, migrationsDir); err != nil {
		log.Fatal("Could not run migrations: ", err)
	}

	log.Println("Migrations completed successfully")
}

func Close() {
	if Pool != nil {
		Pool.Close()
	}
}
	