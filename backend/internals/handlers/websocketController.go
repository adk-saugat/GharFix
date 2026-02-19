package handlers

import (
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/websocket"
	"github.com/gin-gonic/gin"
)

func HandleWebSocketConnection(ctx *gin.Context) {
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	hub := websocket.GetHub()
	websocket.HandleWebSocket(hub, ctx.Writer, ctx.Request, userID.(string))
}
