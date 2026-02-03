package main

import (
	"log"
	"os"

	"github.com/adk-saugat/gharfix/backend/internals/config"
	"github.com/adk-saugat/gharfix/backend/internals/router"
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
	 config.RunMigrations("./migrations")

	//server setup
	server := gin.Default()

	// CORS - allow frontend (Expo web, React Native)
	server.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	router.RegisterRoutes(server)

	PORT := os.Getenv("PORT")
	server.Run("0.0.0.0:" + PORT)
}