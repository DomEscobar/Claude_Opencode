# AGENTS.md

## Backend Context
Go (Golang) Standard Library + Chi Router + Gorm. This is the API layer.

## Hard Rules
- [BE-1] Error handling MUST be explicit. NEVER ignore `err`.
- [BE-2] All DB queries MUST use the repository pattern in `internal/repository`.
- [BE-3] JSON responses MUST match the standard envelope in `internal/types/response.go`.

## Conventions
- Package organization: Domain-driven design.
- Tests: Use `stretchr/testify`.
- Documentation: All public functions MUST have doc comments.

## Commands
```bash
go run cmd/main.go    # Start API server
go test ./internal/...# Run domain tests
make migrate          # Run database migrations
```
