package models

import (
	"context"
	"time"

	"github.com/adk-saugat/gharfix/backend/internals/config"
)

type Message struct {
	ID         string    `json:"id"`
	JobID      string    `json:"jobId"`
	SenderID   string    `json:"senderId"`
	ReceiverID string    `json:"receiverId"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
}

func (m *Message) Create() (*Message, error) {
	query := `
		INSERT INTO messages (job_id, sender_id, receiver_id, content)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`
	err := config.Pool.QueryRow(
		context.Background(),
		query,
		m.JobID,
		m.SenderID,
		m.ReceiverID,
		m.Content,
	).Scan(&m.ID, &m.CreatedAt)
	if err != nil {
		return nil, err
	}
	return m, nil
}

func FetchMessagesByJob(jobID, userID string) ([]Message, error) {
	query := `
		SELECT id, job_id, sender_id, receiver_id, content, created_at
		FROM messages
		WHERE job_id = $1 AND (sender_id = $2 OR receiver_id = $2)
		ORDER BY created_at ASC
	`
	rows, err := config.Pool.Query(context.Background(), query, jobID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var m Message
		rows.Scan(&m.ID, &m.JobID, &m.SenderID, &m.ReceiverID, &m.Content, &m.CreatedAt)
		messages = append(messages, m)
	}
	return messages, nil
}

func GetJobParticipants(jobID string) (string, string, error) {
	var customerID, workerID string
	query := `
		SELECT j.customer_id, ja.worker_id
		FROM jobs j
		JOIN job_applications ja ON j.id = ja.job_id
		WHERE j.id = $1 AND j.status = 'assigned' AND ja.status = 'accepted'
		LIMIT 1
	`
	err := config.Pool.QueryRow(context.Background(), query, jobID).Scan(&customerID, &workerID)
	return customerID, workerID, err
}
