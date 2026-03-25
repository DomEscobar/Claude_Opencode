package auth_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/example/project/internal/auth"
	"github.com/example/project/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHandleLogin_MissingFields(t *testing.T) {
	body := bytes.NewBufferString(`{"email":""}`)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", body)
	rec := httptest.NewRecorder()

	auth.HandleLogin(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code)

	var resp types.APIResponse
	require.NoError(t, json.NewDecoder(rec.Body).Decode(&resp))
	assert.False(t, resp.Success)
}

func TestHandleLogin_InvalidBody(t *testing.T) {
	body := bytes.NewBufferString(`not json`)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", body)
	rec := httptest.NewRecorder()

	auth.HandleLogin(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestHandleLogin_ValidRequest(t *testing.T) {
	body := bytes.NewBufferString(`{"email":"test@example.com","password":"secret"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", body)
	rec := httptest.NewRecorder()

	auth.HandleLogin(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var resp types.APIResponse
	require.NoError(t, json.NewDecoder(rec.Body).Decode(&resp))
	assert.True(t, resp.Success)
}
