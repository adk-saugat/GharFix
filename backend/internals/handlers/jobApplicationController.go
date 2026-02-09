package handlers

import (
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