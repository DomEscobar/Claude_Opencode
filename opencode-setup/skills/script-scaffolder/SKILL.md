---
name: script-scaffolder
description: >
  Use when creating new shell scripts, Python CLIs, or automation scripts.
  Triggers on: "write a script", "shell script", "bash", "python cli",
  "argparse", "makefile", "script template", "automation script",
  "shebang", "cli tool", "command line tool", "bashrc", "cron job script",
  "deployment script", "cleanup script", "build script", "wrapper script".
---

# Script Scaffolder Skill

## Decision Tree — What Are You Building?

```
One-off automation script (cron, cleanup, data fix)?
  → Go to: SHELL_SCRIPT
CLI tool that will be maintained and used repeatedly?
  → Go to: PYTHON_CLI
Multi-step build/deploy process?
  → Go to: MAKEFILE
Script needs to be run by non-technical users?
  → Go to: USER_FACING_SCRIPT
Script that runs in CI/CD?
  → Go to: CI_SCRIPT
```

---

## SHELL_SCRIPT

### Production shell script template:
```bash
#!/usr/bin/env bash
# =============================================================================
# Script: example-cleanup.sh
# Purpose: Clean up old log files older than N days
# Usage:   ./example-cleanup.sh --days 30 --dry-run
# Exit codes:
#   0 = success
#   1 = usage error
#   2 = directory not found
# =============================================================================
set -euo pipefail  # Exit on error, undefined var, pipe failure

# --- Argument parsing -------------------------------------------------
usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

Options:
  -d, --days N       Number of days (default: 30)
  -n, --dry-run      Show what would be deleted (don't actually delete)
  -v, --verbose      Print verbose output
  -h, --help         Show this help message

Examples:
  $0 --days 7 --dry-run   # Preview files older than 7 days
  $0 --days 30            # Delete files older than 30 days
EOF
    exit 1
}

DRY_RUN=false
VERBOSE=false
DAYS=30

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--days) DAYS="$2"; shift 2 ;;
        -n|--dry-run) DRY_RUN=true; shift ;;
        -v|--verbose) VERBOSE=true; shift ;;
        -h|--help) usage ;;
        *) echo "Unknown option: $1"; usage ;;
    esac
done

# Validate
if ! [[ "$DAYS" =~ ^[0-9]+$ ]] || [[ "$DAYS" -lt 1 ]]; then
    echo "Error: --days must be a positive integer"
    exit 1
fi

# --- Configuration ----------------------------------------------------
LOG_DIR="${LOG_DIR:-/var/log/myapp}"
EXCLUDE_PATTERN="${EXCLUDE_PATTERN:-*.gz}"  # never delete already-archived logs

# --- Helper functions -------------------------------------------------
log() { echo "[$(date '+%Y-%m-%dT%H:%M:%S')] $*"; }
info() { log "INFO: $*"; }
warn() { log "WARN: $*" >&2; }
error() { log "ERROR: $*" >&2; }

# --- Pre-flight checks ------------------------------------------------
if [[ ! -d "$LOG_DIR" ]]; then
    error "Log directory does not exist: $LOG_DIR"
    exit 2
fi

if [[ ! -r "$LOG_DIR" ]]; then
    error "Log directory is not readable: $LOG_DIR"
    exit 2
fi

# --- Main logic -------------------------------------------------------
info "Starting cleanup of files older than $DAYS days in $LOG_DIR"
[[ "$DRY_RUN" == true ]] && info "DRY RUN MODE — no files will be deleted"

# Find files, exclude archived logs
mapfile -t files < <(
    find "$LOG_DIR" \
        -type f \
        -name '*.log' \
        ! -name "$EXCLUDE_PATTERN" \
        -mtime "+$DAYS" \
        -print
)

if [[ ${#files[@]} -eq 0 ]]; then
    info "No files older than $DAYS days found. Nothing to do."
    exit 0
fi

total_size=0
deleted_count=0

for file in "${files[@]}"; do
    size=$(stat -c%s "$file" 2>/dev/null || echo 0)
    total_size=$((total_size + size))
    
    if [[ "$VERBOSE" == true ]] || [[ "$DRY_RUN" == true ]]; then
        echo "  $file ($(numfmt --to=iec-i --suffix=B "$size"))"
    fi
    
    if [[ "$DRY_RUN" == false ]]; then
        rm -- "$file" && ((deleted_count++)) || warn "Failed to delete: $file"
    fi
done

info "Cleanup complete. Files found: ${#files[@]}, Deleted: $deleted_count"
info "Space reclaimed: $(numfmt --to=iec-i --suffix=B "$total_size")"
[[ "$DRY_RUN" == true ]] && info "(dry run — nothing actually deleted)"
```

### Cron script wrapper (for cron-based scripts):
```bash
#!/usr/bin/env bash
# Run via cron with locking (prevents double-runs)
LOCKFILE="/tmp/my-script.lock"
TRAP_CMD="rm -f '$LOCKFILE'"

# If script crashes, remove lock
trap "$TRAP_CMD" EXIT

# Ensure only one instance runs
if [[ -f "$LOCKFILE" ]] && kill -0 "$(cat "$LOCKFILE")" 2>/dev/null; then
    echo "Already running (PID $(cat "$LOCKFILE")). Exiting."
    exit 0
fi

echo $$ > "$LOCKFILE"

# Your script logic here...

# Clean up lock on success
rm -f "$LOCKFILE"
trap - EXIT
```

---

## PYTHON_CLI

### Production Python CLI (argparse, with logging):
```python
#!/usr/bin/env python3
"""
CLI tool for processing data files.

Usage:
    python cli.py process --input data.csv --output results.json
    python cli.py validate --input data.csv
"""
import argparse
import logging
import sys
import json
from pathlib import Path
from dataclasses import dataclass

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
__version__ = "1.0.0"
LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
DATE_FORMAT = "%Y-%m-%dT%H:%M:%S"


# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
def setup_logging(verbose: bool = False) -> logging.Logger:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level, format=LOG_FORMAT, datefmt=DATE_FORMAT)
    return logging.getLogger(__name__.split(".")[0])


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------
@dataclass
class ProcessingResult:
    input_file: Path
    output_file: Path | None
    records_processed: int
    errors: list[str]

    def to_dict(self) -> dict:
        return {
            "input": str(self.input_file),
            "output": str(self.output_file) if self.output_file else None,
            "records_processed": self.records_processed,
            "errors": self.errors,
        }


# ---------------------------------------------------------------------------
# Business logic
# ---------------------------------------------------------------------------
def validate_file(path: Path) -> None:
    """Validate input file exists and is readable."""
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    if not path.is_file():
        raise ValueError(f"Not a file: {path}")
    if path.stat().st_size == 0:
        raise ValueError(f"File is empty: {path}")


def process_file(input_path: Path, output_path: Path, log: logging.Logger) -> ProcessingResult:
    """Process the input file and write results."""
    errors = []
    count = 0

    validate_file(input_path)

    with open(input_path, "r", encoding="utf-8") as infile, \
         open(output_path, "w", encoding="utf-8") as outfile:

        for line_num, line in enumerate(infile, start=1):
            try:
                # Example: just echo with line number
                record = line.strip()
                if record:
                    outfile.write(json.dumps({"line": line_num, "data": record}) + "\n")
                    count += 1
            except Exception as e:
                errors.append(f"Line {line_num}: {e}")
                log.debug(f"Error processing line {line_num}: {e}")

    log.info(f"Processed %d records with %d errors", count, len(errors))
    return ProcessingResult(
        input_file=input_path,
        output_file=output_path,
        records_processed=count,
        errors=errors,
    )


# ---------------------------------------------------------------------------
# CLI argument parser
# ---------------------------------------------------------------------------
def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="cli",
        description=__doc__.strip(),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # process subcommand
    p = subparsers.add_parser("process", help="Process input file and write output")
    p.add_argument("--input", "-i", required=True, type=Path, help="Input CSV file")
    p.add_argument("--output", "-o", required=True, type=Path, help="Output JSON file")

    # validate subcommand
    v = subparsers.add_parser("validate", help="Validate input file")
    v.add_argument("--input", "-i", required=True, type=Path, help="Input file to validate")

    return parser


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    log = setup_logging()

    try:
        if args.command == "process":
            result = process_file(args.input, args.output, log)
            if result.errors and log.isEnabledFor(logging.DEBUG):
                log.debug("Errors: %s", json.dumps(result.errors))
            print(json.dumps(result.to_dict(), indent=2))
            return 0 if len(result.errors) == 0 else 1

        elif args.command == "validate":
            validate_file(args.input)
            log.info("Validation passed: %s", args.input)
            print(json.dumps({"valid": True, "file": str(args.input)}))
            return 0

    except FileNotFoundError as e:
        log.error("%s", e)
        return 2
    except ValueError as e:
        log.error("Validation error: %s", e)
        return 1
    except KeyboardInterrupt:
        log.info("Interrupted by user")
        return 130
    except Exception as e:
        log.exception("Unexpected error: %s", e)
        return 2


if __name__ == "__main__":
    sys.exit(main())
```

---

## MAKEFILE

### Production Makefile template:
```makefile
# ==============================================================================
# Makefile — Project automation
# Usage: make <target>
# Prerequisites: docker, docker-compose (for local dev)
# ==============================================================================

.SHELL := /usr/bin/env bash
.DELETE_ON_ERROR:            # Delete target if recipe fails
MAKEFLAGS += --warn-undefined-variables

# --- Configuration ----------------------------------------------------
PROJECT := myapp
VERSION ?= $(shell git describe --tags --always --dirty)
DOCKER_REGISTRY ?= ghcr.io/$(USER)
IMAGE := $(DOCKER_REGISTRY)/$(PROJECT)
PYTHON := python3
PIP := $(PYTHON) -m pip
VENV := .venv
PYTEST := $(VENV)/bin/pytest
MYPY := $(VENV)/bin/mypy

# --- Color output -------------------------------------------------------
BOLD  := $(shell tput bold 2>/dev/null || echo '')
GREEN := $(shell tput setaf 2 2>/dev/null || echo '')
RED   := $(shell tput setaf 1 2>/dev/null || echo '')
RESET := $(shell tput sgr0 2>/dev/null || echo '')

info  = @printf "$(BOLD)$(GREEN)>>>$(RESET) %s\n" "$(1)"
warn  = @printf "$(BOLD)$(RED)!!!$(RESET) %s\n" "$(1)" >&2
run   = @printf "    $@\n" && $(1)

# --- Targets -----------------------------------------------------------
.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-18s$(RESET) %s\n", $$1, $$2}'

# --- Development --------------------------------------------------------
.PHONY: dev
dev: ## Start local development environment
dev: docker-up
	$(call info,Dev environment running at http://localhost:8000)

.PHONY: docker-up
docker-up:
docker-compose up -d --build

.PHONY: docker-down
docker-down:
docker-compose down

.PHONY: test
test: ## Run test suite
test: .venv
	$(call run,$(PYTEST) -v --tb=short tests/)
.PHONY: lint
lint: .venv ## Run linting and type checking
lint:
	$(call run,$(VENV)/bin/black --check src/ tests/)
	$(call run,$(VENV)/bin/isort --check src/ tests/)
	$(call run,$(MYPY) src/)

.PHONY: format
format: .venv ## Auto-format code
format:
	$(VENV)/bin/black src/ tests/
	$(VENV)/bin/isort src/ tests/

# --- Virtual environment -------------------------------------------------
.venv: pyproject.toml
	$(PYTHON) -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -e ".[dev]"
	@touch .venv

# --- Deployment ---------------------------------------------------------
.PHONY: build
build: ## Build Docker image
build:
	docker build \
		--tag $(IMAGE):$(VERSION) \
		--tag $(IMAGE):latest \
		.

.PHONY: deploy-staging
deploy-staging: build  ## Deploy to staging
deploy-staging:
	kubectl apply -f k8s/staging/
	kubectl rollout status deployment/$(PROJECT)-staging -n staging
	$(call info,Deployed version $(VERSION) to staging)

.PHONY: deploy-prod
deploy-prod: build  ## Deploy to production (requires confirmation)
deploy-prod:
	@read -p "Deploy $(VERSION) to production? [y/N] " confirm; \
	[ "$$confirm" = "y" ] || { echo "Aborted."; exit 1; }
	kubectl apply -f k8s/production/
	kubectl rollout status deployment/$(PROJECT) -n production
	$(call info,Deployed version $(VERSION) to production)
```

---

## USER_FACING_SCRIPT (non-technical users)

```bash
#!/usr/bin/env bash
# user-facing-setup.sh — guided setup for non-technical users
# No technical jargon in output. Pure shell, no dependencies.

set -euo pipefail

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

confirm() {
    local prompt="${1:-Continue?}"
    local response
    read -p "$(printf "${BOLD}${prompt} [Y/n]:${RESET} ")" response
    case "${response:-y}" in
        [Nn]*) return 1 ;;
        *)     return 0 ;;
    esac
}

section() {
    printf "\n${BOLD}━━━ %s ━━━${RESET}\n" "$1"
}

info()    { printf "${GREEN}✓${RESET} %s\n" "$1"; }
warn()    { printf "${YELLOW}⚠${RESET} %s\n" "$1"; }
error()   { printf "${RED}✗${RESET} %s\n" "$1" >&2; exit 1; }

section "Welcome to the Setup"
echo "This will install MyApp on your computer. It should take about 5 minutes."
echo ""

if ! confirm "Ready to begin?"; then
    echo "No problem! Run this script again whenever you're ready."
    exit 0
fi

# Only show these if needed
if command -v docker >/dev/null 2>&1; then
    info "Docker is installed"
else
    warn "Docker is not installed. Installing now..."
    # ... installation steps without jargon
fi
```

---

## CI_SCRIPT

```bash
#!/usr/bin/env bash
# =============================================================================
# CI build script — runs in CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
# Should be idempotent, handle all error cases explicitly
# =============================================================================
set -euo pipefail

# CI/CD detection
if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
    CI_PLATFORM="github"
elif [[ -n "${GITLAB_CI:-}" ]]; then
    CI_PLATFORM="gitlab"
else
    CI_PLATFORM="unknown"
fi

# Required env vars (fail fast if missing)
REQUIRED_VARS=("CI_IMAGE" "CI_DEPLOY_ENV")
for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        echo "ERROR: Required environment variable $var is not set"
        exit 1
    fi
done

# Colors only in interactive terminals
if [[ ! -t 1 ]]; then
    BOLD= GREEN= RED= YELLOW= RESET=
else
    BOLD='\033[1m' GREEN='\033[0;32m' RED='\033[0;31m' YELLOW='\033[1;33m' RESET='\033[0m'
fi

log() { echo -e "${GREEN}[CI]${RESET} $*"; }
log_error() { echo -e "${RED}[CI ERROR]${RESET} $*" >&2; }

cleanup() {
    local exit_code=$?
    log "Cleaning up..."
    # Kill any background processes
    jobs -p | xargs -r kill 2>/dev/null || true
    exit $exit_code
}
trap cleanup EXIT

# =============================================================================
# Main pipeline stages
# =============================================================================
log "Starting CI pipeline for ${CI_DEPLOY_ENV}"
log "Platform: ${CI_PLATFORM}, Commit: ${CI_COMMIT_SHA:-unknown}, Version: ${CI_VERSION:-unknown}"

# Stage 1: Lint
log "Stage 1: Running linters..."
./scripts/lint.sh || { log_error "Lint failed"; exit 1; }

# Stage 2: Tests
log "Stage 2: Running tests..."
./scripts/run-tests.sh || { log_error "Tests failed"; exit 1; }

# Stage 3: Build
log "Stage 3: Building Docker image..."
docker build -t "${CI_IMAGE}:${CI_VERSION}" -t "${CI_IMAGE}:${CI_COMMIT_SHA}" . \
    || { log_error "Build failed"; exit 1; }

# Stage 4: Push (only on main/master)
if [[ "${CI_BRANCH:-}" == "main" ]] || [[ -n "${CI_MERGE_REQUEST_ID:-}" ]]; then
    log "Stage 4: Pushing image to registry..."
    echo "${CI_REGISTRY_PASSWORD}" | docker login "${CI_REGISTRY}" -u "${CI_REGISTRY_USER}" --password-stdin
    docker push "${CI_IMAGE}:${CI_VERSION}"
    docker push "${CI_IMAGE}:${CI_COMMIT_SHA}"
fi

log "Pipeline complete! Built ${CI_IMAGE}:${CI_VERSION}"
```
