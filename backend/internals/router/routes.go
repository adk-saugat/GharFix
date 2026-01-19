package router

import (
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/handlers"
	"github.com/adk-saugat/gharfix/backend/internals/middleware"
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

	// protected routes
	protectedRoute := server.Group("/")
	protectedRoute.Use(middleware.Authenticate)

	// protected worker route
	protectedWorkerRoute := protectedRoute.Group("/worker")
	protectedWorkerRoute.Use(middleware.CheckWorker)
	protectedWorkerRoute.POST("/profile", handlers.AddProfile)
}