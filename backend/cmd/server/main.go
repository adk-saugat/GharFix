package main

import (
	"log"
	"os"

	"github.com/adk-saugat/kaamkhoj/backend/internals/config"
	"github.com/adk-saugat/kaamkhoj/backend/internals/router"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){
	// loading env
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Could not load environment.\n Error: %v", err)
	}

	// initialize database
	config.InitializeDatabase()
	defer config.Close()

	// run migrations
	 config.RunMigrations("../../migrations")

	//server setup
	server := gin.Default()

	router.RegisterRoutes(server)

	PORT := os.Getenv("PORT")
	server.Run(":" + PORT)
}