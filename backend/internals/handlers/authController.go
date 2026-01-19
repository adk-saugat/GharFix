package handlers

import (
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/models"
	"github.com/adk-saugat/gharfix/backend/internals/utils"
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

func LoginUser(ctx *gin.Context){
	var loginRequest models.LoginRequest
	err := ctx.ShouldBindJSON(&loginRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse request data.",
		})
		return
	}

	user, err := loginRequest.ValidateCredentials()
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password.",
		})
		return
	}

	// generate token
	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not generate token.",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login successful.",
		"token": token,
		"user": gin.H{
			"id": user.ID,
			"username": user.Username,
			"email": user.Email,
			"phone": user.Phone,
			"role": user.Role,
		},
	})
}