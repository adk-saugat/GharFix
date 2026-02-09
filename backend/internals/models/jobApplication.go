package models

import (
	"context"
	"time"

	"github.com/adk-saugat/gharfix/backend/internals/config"
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