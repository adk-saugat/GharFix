package models

import (
	"context"
	"time"

	"github.com/adk-saugat/gharfix/backend/internals/config"
)

type Job struct{
	ID string `json:"id"`
	CustomerId string `json:"customerId" binding:"required"`
	Title string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Category string `json:"category" binding:"required"`
	Address string `json:"address" binding:"required"`
	Status string `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (job *Job) Create() (*Job, error){
	query := `
		INSERT INTO jobs (customer_id, title, description, category, address)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, status, created_at, updated_at
	`

	row := config.Pool.QueryRow(context.Background(), query, job.CustomerId, job.Title, job.Description, job.Category, job.Address)
	err := row.Scan(&job.ID, &job.Status, &job.CreatedAt, &job.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return job, nil
}