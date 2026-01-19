package router

import (
	"net/http"

	"github.com/adk-saugat/kaamkhoj/backend/internals/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine){
	// health check
	server.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Kaamkhoj backend is running!",
		})
	})

	// auth routes
	server.POST("/auth/register", handlers.RegisterUser)
	server.POST("/auth/login", handlers.LoginUser)
	server.GET("/auth/profile", handlers.AuthMiddleware(), handlers.GetProfile)
}