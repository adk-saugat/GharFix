package handlers

import (
	"net/http"

	"github.com/adk-saugat/kaamkhoj/backend/internals/models"
	"github.com/adk-saugat/kaamkhoj/backend/internals/utils"
	"github.com/gin-gonic/gin"
)

func RegisterUser(ctx *gin.Context){
	var user models.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse request data.",
		})
		return
	}

	// hashing password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not hash password.",
		})
		return
	}
	user.Password = hashedPassword

	err = user.Create()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not create user.",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully.",
		"user": user,
	})
}