package types

type APIResponse struct {
	Success bool   `json:"success"`
	Data    any    `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

func SuccessResponse(data any) APIResponse {
	return APIResponse{Success: true, Data: data}
}

func ErrorResponse(msg string) APIResponse {
	return APIResponse{Success: false, Message: msg}
}
