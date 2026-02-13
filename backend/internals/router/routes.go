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

	protectedWorkerRoute.POST("/profile", handlers.AddWorkerProfile)
	protectedWorkerRoute.GET("/profile", handlers.GetWorkerProfile)

	protectedWorkerRoute.GET("/jobs", handlers.GetAllJobs)
	protectedWorkerRoute.GET("/jobs/applied", handlers.GetMyApplications)
	protectedWorkerRoute.GET("/jobs/:id", handlers.GetJobByID)
	protectedWorkerRoute.POST("/jobs/:id/apply", handlers.ApplyForJob)

	// protected customer route
	protectedCustomerRoute := protectedRoute.Group("/")
	protectedCustomerRoute.Use(middleware.CheckCustomer)

	protectedCustomerRoute.POST("/job", handlers.CreateJob)
	protectedCustomerRoute.GET("/jobs", handlers.GetMyJobs)
	protectedCustomerRoute.GET("/job/:id/applications", handlers.GetJobApplications)
	protectedCustomerRoute.PUT("/job/:id/application/:applicationId/accept", handlers.AcceptApplication)
	protectedCustomerRoute.GET("/profile", handlers.GetCustomerProfile)
}