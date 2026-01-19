package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CheckWorker(ctx *gin.Context){
	userRole := ctx.GetString("userRole")

	if userRole != "worker"{
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Should be a worker to access!", "role": userRole})
		return
	}

	ctx.Next()
}