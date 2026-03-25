---
name: new-go-endpoint
description: Add a new Go API endpoint with Chi router, including request/response types, handler, route registration, and tests. Use when the user asks to add a new API route or endpoint.
---

# Skill: New Go Endpoint

## Before you start
- Read `backend/AGENTS.md` for conventions.
- Check `REGIONAL_MAP.md` to find the right package.
- Handler functions follow the pattern `Handle{Resource}{Action}(w, r)`.
- Responses use the `APIResponse` envelope from `internal/types/response.go`.

## Steps

1. Define request/response types in `backend/internal/types/`.
2. Implement the handler in the appropriate `backend/internal/{domain}/` package.
3. Register the route in `backend/cmd/main.go`.
4. Write a test in the same package (`_test.go` file).
5. Run tests: `go test -v ./internal/...`

## Verify
- `go vet ./...` reports no issues.
- `go test ./internal/...` exits with 0.
- If the endpoint involves pagination, confirm with the user: offset-based or cursor-based?
