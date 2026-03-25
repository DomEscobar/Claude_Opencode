---
name: database-migration
description: Create safe, reversible database schema migrations with up/down operations and backward compatibility. Use when the user asks to change the database schema, add tables, columns, indexes, or constraints.
---

# Skill: Database Migration

## Before you start
- Read `backend/AGENTS.md` for conventions.
- Check existing migrations in `backend/migrations/` to understand the current schema.
- Migrations must be backward-compatible with the running application.

## Rules
- Every migration must have both an **up** and a **down** operation.
- New columns must be nullable or have a default value (no breaking existing rows).
- Never drop a column directly. Use the expand-contract pattern:
  1. Add the new column (migration 1, deploy)
  2. Migrate data and update code to use the new column (migration 2, deploy)
  3. Drop the old column only after confirming no code references it (migration 3)
- Never rename a column in a single step -- treat it as add-new + migrate-data + drop-old.
- Index creation on large tables should use `CREATE INDEX CONCURRENTLY` (PostgreSQL).

## Steps

1. Create a new migration file in `backend/migrations/` with a timestamped name:
   ```
   backend/migrations/{YYYYMMDDHHMMSS}_{description}.sql
   ```
2. Write the `-- +migrate Up` section with the schema change.
3. Write the `-- +migrate Down` section that fully reverses it.
4. Test locally:
   - Apply: run the up migration
   - Verify: check the schema looks correct
   - Rollback: run the down migration
   - Re-apply: run up again to confirm idempotency
5. If the migration adds types referenced in Go code, update `backend/internal/types/schemas.go`.

## Verify
- Migration applies cleanly on a fresh database.
- Migration rolls back without errors.
- Existing tests still pass: `go test ./internal/...`
- If new fields were added, corresponding Go struct tags exist in `internal/types/`.
