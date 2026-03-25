package backend

import "time"

// USER AUTH ENUMERATION - CONTRACT NODE
// Ground Truth for User Login Flow

type User struct {
	ID        string    `json:"id" validate:"regexp=^user_"`
	Email     string    `json:"email"`
	Token     string    `json:"token"`
	CreatedAt time.Time `json:"created_at"`
}

type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Success bool   `json:"success"`
	Data    *User  `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}
