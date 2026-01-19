package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddProfile(ctx *gin.Context){
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Added Profile",
	})
}