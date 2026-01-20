package models

import (
	"context"
	"time"

	"github.com/adk-saugat/gharfix/backend/internals/config"
)

type WorkerProfiles struct{
	ID 					string 		`json:"id"`
	UserId				string 		`json:"userId" binding:"required"`
	Skills 				[]string 	`json:"skills" binding:"required"`
	HourlyRate 			int64 		`json:"hourlyRate" binding:"required"`
	CompletedJobs 		int64 		`json:"completedJobs"`
	AvgRating 			float64 	`json:"avgRating"`
	VerificationLevel 	string 		`json:"verificationLevel"`
	CreatedAt 			time.Time 	`json:"createdAt"`
}

type WorkerInfo struct{
	ID					string 		`json:"id"`
	Username 			string 		`json:"username" binding:"required"`
	Email	 			string 		`json:"email" binding:"required"`
	Phone 				string 		`json:"phone,omitempty"`
	Skills 				[]string 	`json:"skills" binding:"required"`
	HourlyRate 			int64 		`json:"hourlyRate" binding:"required"`
	CompletedJobs 		int64 		`json:"completedJobs"`
	AvgRating 			float64 	`json:"avgRating"`
	VerificationLevel 	string 		`json:"verificationLevel"`
	CreatedAt 			time.Time 	`json:"createdAt"`
}

func (profile *WorkerProfiles) AddProfile() (*WorkerProfiles, error){
	query := `
		INSERT INTO worker_profiles (userId, skills, hourlyRate)
		VALUES ($1, $2, $3)
		RETURNING id, completedJobs, avgRating, verificationLevel, createdAt
	`

	row := config.Pool.QueryRow(context.Background(), query, profile.UserId, profile.Skills, profile.HourlyRate)
	err := row.Scan(&profile.ID, &profile.CompletedJobs, &profile.AvgRating, &profile.VerificationLevel, &profile.CreatedAt)
	if err != nil {
		return nil, err
	}
	return profile, nil
}

func GetWorkerInfoById(workerId string) (*WorkerInfo, error){
	query := `
		SELECT users.id, username, email, phone, skills, hourlyRate, completedJobs, avgRating, verificationLevel, createdAt FROM users
		JOIN worker_profiles ON users.id = worker_profiles.userId
		WHERE users.id = $1
	`

	var workerInfo WorkerInfo
	row := config.Pool.QueryRow(context.Background(), query, workerId)
	err := row.Scan(&workerInfo.ID, &workerInfo.Username, &workerInfo.Email, &workerInfo.Phone, &workerInfo.Skills, &workerInfo.HourlyRate, &workerInfo.CompletedJobs, &workerInfo.AvgRating, &workerInfo.VerificationLevel, &workerInfo.CreatedAt)
	if err != nil {
		return nil, err
	}
	
	return &workerInfo, nil
}