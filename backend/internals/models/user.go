package models

import (
	"context"

	"github.com/adk-saugat/kaamkhoj/backend/internals/config"
	"github.com/adk-saugat/kaamkhoj/backend/internals/utils"
)

type User struct{
	ID			string `json:"id"`
	Username 	string `json:"username" binding:"required"`
	Email	 	string `json:"email" binding:"required"`
	Password 	string `json:"password" binding:"required"`
	Phone 		string `json:"phone,omitempty"`
	Role		string `json:"role" binding:"required"`
}

type LoginRequest struct{
	Email	 	string `json:"email" binding:"required"`
	Password 	string `json:"password" binding:"required"`
}

func (user *User) Create() error{
	query := `
		INSERT INTO users (username, email, password, phone, role)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`

	row := config.Pool.QueryRow(context.Background(), query, user.Username, user.Email, user.Password, user.Phone, user.Role)
	err := row.Scan(&user.ID)
	return err
}

func (request *LoginRequest) ValidateCredentials() (*User, error){
	query := `
		SELECT id, username, email, password, phone, role
		FROM users
		WHERE email = $1
	`

	var user User
	row := config.Pool.QueryRow(context.Background(), query, request.Email)
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Phone, &user.Role)
	if err != nil {
		return nil, err
	}

	err = utils.ComparePassword(user.Password, request.Password)
	if err != nil {
		return nil, err
	}

	return &user, nil
}