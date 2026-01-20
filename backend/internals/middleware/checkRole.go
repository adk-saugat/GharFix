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

func CheckCustomer(ctx *gin.Context){
	userRole := ctx.GetString("userRole")

	if userRole != "customer"{
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Should be a customer to access!", "role": userRole})
		return
	}

	ctx.Next()
}