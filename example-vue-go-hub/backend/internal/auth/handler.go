package auth

import (
	"encoding/json"
	"net/http"

	"github.com/example/project/internal/types"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req types.AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(types.ErrorResponse("invalid request body"))
		return
	}

	if req.Email == "" || req.Password == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(types.ErrorResponse("email and password are required"))
		return
	}

	// TODO: Replace with actual authentication via UserRepository
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(types.SuccessResponse(map[string]string{
		"message": "login endpoint ready",
	}))
}
