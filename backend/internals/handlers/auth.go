package handlers

import (
	"net/http"

	"github.com/adk-saugat/kaamkhoj/backend/internals/models"
	"github.com/gin-gonic/gin"
)

func RegisterUser(ctx *gin.Context){
	var user *models.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse request data.",
		})
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully.",
		"user": user,
	})
}