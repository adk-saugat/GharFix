package middleware

import (
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/utils"
	"github.com/gin-gonic/gin"
)

func Authenticate(ctx *gin.Context){
	token := ctx.Request.Header.Get("Authorization")
	if token == ""{
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Couldnot authenticate!"})
		return
	}

	userId, userRole, err := utils.VerifyToken(token)
	if err != nil{
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Couldnot authenticate!"})
		return
	}

	ctx.Set("userId", userId)
	ctx.Set("userRole", userRole)
	ctx.Next()
}

// AuthenticateWebSocket gets token from query "token" or Authorization header (for WebSocket connections).
func AuthenticateWebSocket(ctx *gin.Context) {
	token := ctx.Query("token")
	if token == "" {
		token = ctx.Request.Header.Get("Authorization")
	}
	if token == "" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Could not authenticate!"})
		return
	}

	userId, userRole, err := utils.VerifyToken(token)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Could not authenticate!"})
		return
	}

	ctx.Set("userId", userId)
	ctx.Set("userRole", userRole)
	ctx.Next()
}