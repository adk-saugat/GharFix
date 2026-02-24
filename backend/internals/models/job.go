package models

import (
	"context"
	"errors"
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

const jobWithCustomerQuery = `
	SELECT jobs.id, customer_id, users.username, users.phone, title, description, category, address, status, created_at
	FROM jobs
	JOIN users ON jobs.customer_id = users.id
`

func scanJobWithCustomer(row interface {
	Scan(dest ...interface{}) error
}, j *JobWithCustomerDetails) error {
	return row.Scan(&j.ID, &j.CustomerId, &j.Username, &j.Phone, &j.Title, &j.Description, &j.Category, &j.Address, &j.Status, &j.CreatedAt)
}

func FetchAllJobs() (*[]JobWithCustomerDetails, error) {
	rows, err := config.Pool.Query(context.Background(), jobWithCustomerQuery+" WHERE jobs.status = 'open' ORDER BY jobs.created_at DESC")
	if err != nil {
		return nil, err
	}

	var jobDetails []JobWithCustomerDetails
	for rows.Next() {
		var jobDetail JobWithCustomerDetails
		if err := scanJobWithCustomer(rows, &jobDetail); err != nil {
			return nil, err
		}
		jobDetails = append(jobDetails, jobDetail)
	}
	return &jobDetails, nil
}

// FetchJobByID returns a job by id. If customerID is not nil, the job is returned only if it belongs to that customer.
func FetchJobByID(id string, customerID *string) (*JobWithCustomerDetails, error) {
	var jobDetail JobWithCustomerDetails
	var err error
	if customerID != nil {
		err = scanJobWithCustomer(
			config.Pool.QueryRow(context.Background(), jobWithCustomerQuery+" WHERE jobs.id = $1 AND jobs.customer_id = $2", id, *customerID),
			&jobDetail,
		)
	} else {
		err = scanJobWithCustomer(
			config.Pool.QueryRow(context.Background(), jobWithCustomerQuery+" WHERE jobs.id = $1", id),
			&jobDetail,
		)
	}
	if err != nil {
		return nil, err
	}
	return &jobDetail, nil
}

// MarkJobComplete sets job status to "completed" if the worker is the accepted worker and job is "assigned".
func MarkJobComplete(jobID, workerID string) error {
	query := `
		UPDATE jobs SET status = 'completed', updated_at = NOW()
		WHERE id = $1 AND status = 'assigned'
		AND EXISTS (
			SELECT 1 FROM job_applications
			WHERE job_id = $1 AND worker_id = $2 AND status = 'accepted'
		)
	`
	cmd, err := config.Pool.Exec(context.Background(), query, jobID, workerID)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return ErrJobCompleteFailed
	}
	return nil
}

var ErrJobCompleteFailed = errors.New("job not found, not assigned, or worker not accepted")

func FetchJobsByCustomerID(customerID string) ([]JobWithCustomerDetails, error) {
	rows, err := config.Pool.Query(context.Background(), jobWithCustomerQuery+" WHERE jobs.customer_id = $1 ORDER BY jobs.created_at DESC", customerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var jobs []JobWithCustomerDetails
	for rows.Next() {
		var j JobWithCustomerDetails
		if err := scanJobWithCustomer(rows, &j); err != nil {
			return nil, err
		}
		jobs = append(jobs, j)
	}
	return jobs, nil
}