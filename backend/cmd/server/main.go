package main

import (
	"log"
	"net/http"
	"os"

	"github.com/adk-saugat/kaamkhoj/backend/internals/config"
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

	//server setup
	server := gin.Default()

	server.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Kaamkhoj backend is running!",
		})
	})

	PORT := os.Getenv("PORT")
	server.Run(":" + PORT)
}