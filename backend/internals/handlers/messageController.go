package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/adk-saugat/gharfix/backend/internals/models"
	"github.com/adk-saugat/gharfix/backend/internals/websocket"
	"github.com/gin-gonic/gin"
)

func GetMessages(ctx *gin.Context) {
	jobID := ctx.Param("id")
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	messages, err := models.FetchMessagesByJob(jobID, userID.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch messages"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"messages": messages})
}

func SendMessage(ctx *gin.Context) {
	jobID := ctx.Param("id")
	senderID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var body struct {
		Content string `json:"content" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}

	customerID, workerID, err := models.GetJobParticipants(jobID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Job not found or not assigned"})
		return
	}

	receiverID := customerID
	if senderID.(string) == customerID {
		receiverID = workerID
	}

	message := &models.Message{
		JobID:      jobID,
		SenderID:   senderID.(string),
		ReceiverID: receiverID,
		Content:    body.Content,
	}

	created, err := message.Create()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not send message"})
		return
	}

	hub := websocket.GetHub()
	messageJSON, _ := json.Marshal(created)
	hub.SendToUser(receiverID, messageJSON)

	ctx.JSON(http.StatusCreated, gin.H{"message": created})
}
