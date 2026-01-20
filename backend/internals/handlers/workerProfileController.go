package handlers

import (
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/models"
	"github.com/gin-gonic/gin"
)

func AddProfile(ctx *gin.Context){
	var profileRequest models.WorkerProfiles
	err := ctx.ShouldBindJSON(&profileRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldnot parse request data.",
		})
		return
	}

	workerProfile, err := profileRequest.AddProfile()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot add worker profile.",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Worker Profile added successfully!",
		"profile": workerProfile,
	})
}

func GetProfile(ctx *gin.Context){
	userId := ctx.GetString("userId")

	workerInfo, err := models.GetWorkerInfoById(userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot fetch worker profile.",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"worker": workerInfo,
	})
}