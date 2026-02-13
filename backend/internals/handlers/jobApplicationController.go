package handlers

import (
	"errors"
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/models"
	"github.com/gin-gonic/gin"
)

func ApplyForJob(ctx *gin.Context) {
	jobID := ctx.Param("id")
	if jobID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Job ID is required."})
		return
	}

	workerID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized."})
		return
	}

	var body struct {
		ProposedPrice float64 `json:"proposedPrice" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "proposedPrice is required."})
		return
	}

	application := models.JobApplication{
		JobID:         jobID,
		WorkerID:      workerID.(string),
		ProposedPrice: body.ProposedPrice,
	}

	created, err := application.Create()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not submit application."})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message":     "Application submitted successfully.",
		"application": created,
	})
}

func GetJobApplications(ctx *gin.Context) {
	jobID := ctx.Param("id")
	if jobID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Job ID is required."})
		return
	}

	customerID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized."})
		return
	}

	applications, err := models.FetchApplicationsForJob(jobID, customerID.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch applications."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"applications": applications})
}

func GetMyApplications(ctx *gin.Context) {
	workerID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized."})
		return
	}
	jobs, err := models.FetchJobsAppliedByWorker(workerID.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch applications."})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"jobs": jobs})
}

func AcceptApplication(ctx *gin.Context) {
	jobID := ctx.Param("id")
	applicationID := ctx.Param("applicationId")
	if jobID == "" || applicationID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Job ID and Application ID are required."})
		return
	}

	customerID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized."})
		return
	}

	err := models.AcceptApplication(applicationID, jobID, customerID.(string))
	if err != nil {
		if errors.Is(err, models.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Application or job not found."})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not accept application."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Application accepted."})
}