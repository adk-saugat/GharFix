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

type JobWithCustomerDetails struct{
	ID string `json:"id"`
	CustomerId string `json:"customerId" binding:"required"`
	Username string `json:"username" binding:"required"`
	Phone string `json:"phone" binding:"required"`
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

func FetchAllJobs() (*[]JobWithCustomerDetails, error){
	query := `
		SELECT jobs.id, customer_id, users.username, users.phone, title, description, category, address, status, created_at
		FROM jobs
		JOIN users ON jobs.customer_id = users.id
	`

	rows, err := config.Pool.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}

	var jobDetails []JobWithCustomerDetails
	for rows.Next(){
		var jobDetail JobWithCustomerDetails
		err = rows.Scan(&jobDetail.ID, &jobDetail.CustomerId, &jobDetail.Username, &jobDetail.Phone, &jobDetail.Title, &jobDetail.Description, &jobDetail.Category, &jobDetail.Address, &jobDetail.Status, &jobDetail.CreatedAt)
		if err != nil {
			return nil, err
		}
		jobDetails = append(jobDetails, jobDetail)
	}
	return &jobDetails, nil
}

func FetchJobByID(id string) (*JobWithCustomerDetails, error) {
	query := `
		SELECT jobs.id, customer_id, users.username, users.phone, title, description, category, address, status, created_at
		FROM jobs
		JOIN users ON jobs.customer_id = users.id
		WHERE jobs.id = $1
	`
	var jobDetail JobWithCustomerDetails
	err := config.Pool.QueryRow(context.Background(), query, id).Scan(
		&jobDetail.ID, &jobDetail.CustomerId, &jobDetail.Username, &jobDetail.Phone,
		&jobDetail.Title, &jobDetail.Description, &jobDetail.Category, &jobDetail.Address,
		&jobDetail.Status, &jobDetail.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &jobDetail, nil
}