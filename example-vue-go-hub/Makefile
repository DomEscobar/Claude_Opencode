.PHONY: help dev-backend dev-frontend dev test test-backend test-frontend lint lint-backend lint-frontend build typecheck validate validate-backend validate-frontend clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# --- Development ---

dev-backend: ## Start the Go API server
	cd backend && go run cmd/main.go

dev-frontend: ## Start the Vite dev server
	cd frontend && pnpm dev

dev: ## Start both backend and frontend (backend in background)
	@echo "Starting backend on :8080 and frontend on :5173..."
	cd backend && go run cmd/main.go &
	cd frontend && pnpm dev

# --- Testing ---

test: test-backend test-frontend ## Run all tests

test-backend: ## Run Go tests
	cd backend && go test ./internal/...

test-frontend: ## Run Vue/Vitest tests
	cd frontend && pnpm test:unit

# --- Linting ---

lint: lint-backend lint-frontend ## Run all linters

lint-backend: ## Run go vet
	cd backend && go vet ./...

lint-frontend: ## Run ESLint and vue-tsc
	cd frontend && pnpm lint
	cd frontend && pnpm typecheck

# --- Build ---

build: ## Build frontend for production
	cd frontend && pnpm build

typecheck: ## Typecheck frontend
	cd frontend && pnpm typecheck

# --- Validation ---

validate: validate-backend validate-frontend ## Validate project structure

validate-backend: ## Check backend structure is complete
	cd backend && go run ../infrastructure/scripts/validate_backend.go

validate-frontend: ## Check frontend structure is complete
	cd frontend && node ../infrastructure/scripts/validate_frontend.mjs

# --- Cleanup ---

clean: ## Remove build artifacts
	rm -rf frontend/dist
	rm -rf backend/tmp
