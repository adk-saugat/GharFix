package models

import (
	"context"
	"errors"
	"time"

	"github.com/adk-saugat/gharfix/backend/internals/config"
	"github.com/jackc/pgx/v5"
)

type JobApplication struct {
	ID            string    `json:"id"`
	JobID         string    `json:"jobId" binding:"required"`
	WorkerID      string    `json:"workerId" binding:"required"`
	ProposedPrice float64   `json:"proposedPrice" binding:"required"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"createdAt"`
}

func (app *JobApplication) Create() (*JobApplication, error) {
	query := `
		INSERT INTO job_applications (job_id, worker_id, proposed_price)
		VALUES ($1, $2, $3)
		RETURNING id, status, created_at
	`
	err := config.Pool.QueryRow(context.Background(), query, app.JobID, app.WorkerID, app.ProposedPrice).
		Scan(&app.ID, &app.Status, &app.CreatedAt)
	if err != nil {
		return nil, err
	}
	return app, nil
}

// FetchApplicationByJobAndWorker returns the worker's application for the job, or (nil, nil) if none.
func FetchApplicationByJobAndWorker(jobID, workerID string) (*JobApplication, error) {
	query := `
		SELECT id, job_id, worker_id, proposed_price, status, created_at
		FROM job_applications
		WHERE job_id = $1 AND worker_id = $2
	`
	var app JobApplication
	err := config.Pool.QueryRow(context.Background(), query, jobID, workerID).
		Scan(&app.ID, &app.JobID, &app.WorkerID, &app.ProposedPrice, &app.Status, &app.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &app, nil
}

type ApplicationWithWorker struct {
	ID            string    `json:"id"`
	JobID         string    `json:"jobId"`
	WorkerID      string    `json:"workerId"`
	WorkerName    string    `json:"workerName"`
	WorkerPhone   string    `json:"workerPhone"`
	ProposedPrice float64   `json:"proposedPrice"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"createdAt"`
}

func FetchApplicationsForJob(jobID, customerID string) ([]ApplicationWithWorker, error) {
	query := `
		SELECT ja.id, ja.job_id, ja.worker_id, u.username, u.phone, ja.proposed_price, ja.status, ja.created_at
		FROM job_applications ja
		JOIN jobs j ON ja.job_id = j.id
		JOIN users u ON ja.worker_id = u.id
		WHERE ja.job_id = $1 AND j.customer_id = $2
		ORDER BY ja.created_at DESC
	`
	rows, err := config.Pool.Query(context.Background(), query, jobID, customerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []ApplicationWithWorker
	for rows.Next() {
		var app ApplicationWithWorker
		err := rows.Scan(&app.ID, &app.JobID, &app.WorkerID, &app.WorkerName, &app.WorkerPhone, &app.ProposedPrice, &app.Status, &app.CreatedAt)
		if err != nil {
			return nil, err
		}
		applications = append(applications, app)
	}
	return applications, nil
}

func AcceptApplication(applicationID, jobID, customerID string) error {
	query := `
		UPDATE job_applications
		SET status = 'accepted'
		WHERE id = $1 AND job_id = $2
		AND EXISTS (SELECT 1 FROM jobs WHERE id = $2 AND customer_id = $3)
	`
	cmd, err := config.Pool.Exec(context.Background(), query, applicationID, jobID, customerID)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return ErrNoRows
	}
	// Reject other applications for the same job
	_, _ = config.Pool.Exec(context.Background(),
		`UPDATE job_applications SET status = 'rejected' WHERE job_id = $1 AND id != $2`,
		jobID, applicationID)
	return nil
}

var ErrNoRows = errors.New("no rows affected")

// AppliedJob is a job the worker has applied to, with application details.
type AppliedJob struct {
	ID                string    `json:"id"`
	CustomerID        string    `json:"customerId"`
	Username          string    `json:"username"`
	Phone             string    `json:"phone"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	Category          string    `json:"category"`
	Address           string    `json:"address"`
	Status            string    `json:"status"`
	CreatedAt         time.Time `json:"createdAt"`
	ApplicationStatus string    `json:"applicationStatus"`
	ProposedPrice     float64   `json:"proposedPrice"`
}

// FetchJobsAppliedByWorker returns all jobs the worker has applied to, with application status and proposed price.
func FetchJobsAppliedByWorker(workerID string) ([]AppliedJob, error) {
	query := `
		SELECT j.id, j.customer_id, u.username, COALESCE(u.phone, '') AS phone,
		       j.title, j.description, j.category, j.address, j.status, j.created_at,
		       ja.status AS application_status, ja.proposed_price
		FROM job_applications ja
		JOIN jobs j ON ja.job_id = j.id
		JOIN users u ON j.customer_id = u.id
		WHERE ja.worker_id = $1
		ORDER BY ja.created_at DESC
	`
	rows, err := config.Pool.Query(context.Background(), query, workerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []AppliedJob
	for rows.Next() {
		var a AppliedJob
		err := rows.Scan(&a.ID, &a.CustomerID, &a.Username, &a.Phone, &a.Title, &a.Description,
			&a.Category, &a.Address, &a.Status, &a.CreatedAt, &a.ApplicationStatus, &a.ProposedPrice)
		if err != nil {
			return nil, err
		}
		list = append(list, a)
	}
	return list, nil
}