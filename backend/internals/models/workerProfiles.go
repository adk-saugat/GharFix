package models

import "time"

type WorkerProfiles struct{
	ID 					string 		`json:"id"`
	UserId				string 		`json:"userId" binding:"required"`
	Skills 				[]string 	`json:"skills" binding:"required"`
	BaseRate 			int64 		`json:"baseRate" binding:"required"`
	CompletedJobs 		int64 		`json:"completedJobs,omitempty"`
	AvgRating 			float64 	`json:"avgRating,omitempty"`
	VerificationLevel 	string 		`json:"verificationLevel,omitempty"`
	CreatedAt 			time.Time 	`json:"createdAt"`
}