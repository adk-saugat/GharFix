package models

import (
	"context"

	"github.com/adk-saugat/kaamkhoj/backend/internals/config"
)

type User struct{
	Username 	string `json:"username" binding:"required"`
	Email	 	string `json:"email" binding:"required"`
	Password 	string `json:"password" binding:"required"`
	Phone 		string `json:"phone,omitempty"`
	Role		string `json:"role" binding:"required"`
}

func (user *User) Create() error{
	query := `
		INSERT INTO users (username, email, password, phone, role)
		VALUES ($1, $2, $3, $4, $5)
	`

	_, err := config.Pool.Exec(context.Background(), query, user.Username, user.Email, user.Password, user.Phone, user.Role)
	return err
}
