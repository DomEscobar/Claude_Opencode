# agents/skills/new-go-endpoint.md

## Trigger
User asks to create a new API endpoint, handler, or route in Go.

## Steps
1. Create the data structure in `internal/types/request.go`.
2. Implement the repository function in `internal/repository/{domain}.go`.
3. Add the business logic in `internal/service/{domain}.go`.
4. Register the route in `cmd/router.go`.
5. Add a unit test in `internal/service/{domain}_test.go`.

## Verification
- Run `go test ./internal/...`
- Check for "zero errors" in the terminal output.
