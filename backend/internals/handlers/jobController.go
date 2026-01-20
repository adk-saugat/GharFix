package handlers

import (
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/models"
	"github.com/gin-gonic/gin"
)

func CreateJob(ctx *gin.Context){
	var jobRequest models.Job
	err := ctx.ShouldBindJSON(&jobRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldnot parse request data.",
		})
		return
	}

	job, err := jobRequest.Create()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot create the job.",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Job created successfully!",
		"job": job,
	})
}