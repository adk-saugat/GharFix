package handlers

import (
	"errors"
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/models"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
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

func GetAllJobs(ctx *gin.Context){
	jobs, err := models.FetchAllJobs()
	if err != nil{
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot fetch jobs.",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"jobs": jobs,
	})
}

func GetJobByID(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Job ID is required."})
		return
	}
	job, err := models.FetchJobByID(id, nil)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Job not found."})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch job."})
		return
	}
	workerID, _ := ctx.Get("userId")
	myApplication, _ := models.FetchApplicationByJobAndWorker(id, workerID.(string))
	resp := gin.H{"job": job}
	if myApplication != nil {
		resp["myApplication"] = myApplication
	}
	ctx.JSON(http.StatusOK, resp)
}

func GetMyJobs(ctx *gin.Context) {
	customerID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized."})
		return
	}
	jobs, err := models.FetchJobsByCustomerID(customerID.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch jobs."})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"jobs": jobs})
}