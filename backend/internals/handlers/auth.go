package handlers

import (
	"net/http"
	"strings"

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
	token, err := utils.GenerateToken(user.ID)
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

// AuthMiddleware validates JWT tokens for protected routes
func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header required",
			})
			ctx.Abort()
			return
		}

		// Check if it starts with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authorization format",
			})
			ctx.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			ctx.Abort()
			return
		}

		// Set user ID in context for use in handlers
		ctx.Set("user_id", claims.UserID)
		ctx.Next()
	}
}

// GetProfile returns the current user's profile (protected route)
func GetProfile(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	// In a real app, you'd fetch the full user from database
	// For now, just return the user ID
	ctx.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"message": "Profile retrieved successfully",
	})
}