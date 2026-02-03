package handlers

import (
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/models"
	"github.com/gin-gonic/gin"
)

func GetCustomerProfile(ctx *gin.Context){
	userID := ctx.GetString("userId")

	var user models.User
	userProfile, err := user.FetchCustomerProfile(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"user": userProfile,
	})
}