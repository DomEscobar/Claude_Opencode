# Backend AGENTS.md

## Stack
Go + Chi router + GORM. Source code lives in `backend/`.

## Rules
- **[BE-1]** Always handle errors explicitly. Never use `_` to discard an `err` value.
- **[BE-2]** All database queries go through the repository pattern in `internal/repository/`.
- **[BE-3]** All JSON responses use the `APIResponse` envelope from `internal/types/response.go`.
- **[BE-4]** All public functions must have doc comments.
- **[BE-5]** Never use `interface{}` / `any` when the concrete type is known.
- **[BE-6]** No business logic in handlers. Handlers parse input, call a service or repository, and return a response.

## Conventions
- Package layout follows domain-driven design under `internal/`.
- Tests use `stretchr/testify` and live next to the code they test (`_test.go` suffix).
- Domain types and contracts live in `internal/types/`.
- Handler functions follow the pattern `Handle{Resource}{Action}(w, r)`.

## Commands (project-wide)
```bash
go run cmd/main.go         # Start the API server on :8080
go test ./internal/...     # Run all domain tests
go test -v ./internal/auth/...  # Run auth tests with verbose output
go vet ./...               # Static analysis
```

## Commands (single-file -- prefer these for faster feedback)
```bash
go vet ./internal/auth/handler.go          # Vet one file
go test -v -run TestHandleLogin ./internal/auth/  # Run one test by name
go test -count=1 ./internal/auth/          # Run one package, no cache
```

## Examples to Follow
- Handler: `internal/auth/handler.go` -- request parsing, validation, envelope response
- Test: `internal/auth/handler_test.go` -- table-driven, httptest, testify assertions
- Repository: `internal/repository/user.go` -- GORM queries behind an interface
- Types: `internal/types/schemas.go` -- domain structs with JSON and GORM tags
- Response envelope: `internal/types/response.go` -- `SuccessResponse()` / `ErrorResponse()`

## Anti-Patterns
- Don't ignore errors with `_`
- Don't put SQL queries outside `internal/repository/`
- Don't return raw structs -- always wrap in `APIResponse`
- Don't use `fmt.Println` for logging in production code
