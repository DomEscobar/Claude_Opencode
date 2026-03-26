---
name: db-schema-diff
description: >
  Use when discussing database schema changes, migrations, diffs, rollbacks,
  or PostgreSQL/MySQL/SQLite schema management. Triggers on: "schema diff",
  "migration", "ALTER TABLE", "db schema", "database schema", "rollback migration",
  "add column", "drop column", "schema change", "Flyway", "Liquibase", "Alembic".
---

# DB Schema Diff & Migration Skill

## Decision Tree — What Are You Doing?

```
1. Planning a schema change?
   → Go to: SCHEMA CHANGE PLANNING
2. Comparing two schemas (live vs desired)?
   → Go to: SCHEMA DIFF
3. Writing a migration (up + down)?
   → Go to: MIGRATION SCAFFOLD
4. Rolling back a bad migration?
   → Go to: ROLLBACK PLAYBOOK
5. Checking migration health in production?
   → Go to: MIGRATION HEALTH CHECK
```

---

## SCHEMA CHANGE PLANNING

### Golden Rules
1. **No column renames in a single migration** — add + migrate data + drop (3-step)
2. **Always add nullable columns first** — backfill in separate step
3. **Never drop a column in the same deploy as code that reads it** — 2-phase drop
4. **Index creation is non-blocking on PostgreSQL** — `CREATE INDEX CONCURRENTLY`
5. **Keep migration IDs sequential** — no out-of-order execution

### PostgreSQL Safe Patterns

```sql
-- ADD COLUMN (safe, no lock)
ALTER TABLE events ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP;

-- ADD COLUMN with default (PostgreSQL 11+, safe)
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'member';

-- ADD NOT NULL column with default (PostgreSQL 11+, safe — writes existing rows once)
ALTER TABLE orders ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending';

-- DROP COLUMN (safe — only locks the column being dropped)
ALTER TABLE users DROP COLUMN IF EXISTS legacy_token;

-- RENAME COLUMN (2-phase)
-- Phase 1: add new column, backfill, dual-write
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
UPDATE users SET display_name = full_name WHERE display_name IS NULL;
-- Phase 2 (next deploy): drop old column
ALTER TABLE users DROP COLUMN IF EXISTS full_name;

-- Safe index creation (no table lock)
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
-- Rollback:
DROP INDEX CONCURRENTLY idx_orders_user_id;

-- Unique index (must be CONCURRENTLY for existing table)
CREATE UNIQUE INDEX CONCURRENTLY idx_users_email ON users(email);
```

### MySQL Gotchas
```sql
-- In MySQL, ADD COLUMN locks the table — do during low-traffic window
ALTER TABLE orders ADD COLUMN tracking_id VARCHAR(100) AFTER id;

-- Dropping columns is also blocking — use pt-online-schema-change for large tables
-- Or: 3-step rename pattern
```

---

## SCHEMA DIFF

### Generate diff between two DBs (PostgreSQL)
```bash
# Using pg_dump
pg_dump --schema-only old_db > old_schema.sql
pg_dump --schema-only new_db > new_schema.sql
diff -u old_schema.sql new_schema.sql

# Using sqldiff (SQLite) or similar tools
sqldiff old.db new.db

# Using JetBrains DataGrip / DBeaver: Schema Comparison tool
```

### Generate diff from migration history
```bash
# Show migrations not yet applied
flyway -locations=filesystem:./migrations info
alembic history --verbose

# Show what would run (dry-run)
flyway -locations=filesystem:./migrations migrate -dryRun=true
alembic upgrade +1 --sql
```

### Diff output interpretation
```diff
- DROP TABLE old_events;   # ⚠️ Data loss — confirm backup exists
- DROP COLUMN email;        # ⚠️ Code may still read this
+ ADD COLUMN processed_at; # ✅ Usually safe
+ ADD INDEX;                # ✅ Safe with CONCURRENTLY
```

---

## MIGRATION SCAFFOLD

### PostgreSQL — Alembic-style (Python)
```python
"""${revision} ${message}
${up_items}
${down_items}
"""
from alembic import op
import sqlalchemy as sa

# revision identifier
revision = '${revision_id}'
down_revision = '${parent_revision_id}'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('users', sa.Column('display_name', sa.String(255), nullable=True))
    # Backfill
    op.execute("UPDATE users SET display_name = full_name WHERE display_name IS NULL")
    op.alter_column('users', 'display_name', nullable=False)

def downgrade() -> None:
    op.drop_column('users', 'display_name')
```

### Go — golang-migrate
```bash
# Create migration
migrate create -ext sql -dir ./migrations -seq add_display_name_to_users
# Writes: 000042_add_display_name_to_users.up.sql + .down.sql
```

```sql
-- 000042_add_display_name_to_users.up.sql
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
UPDATE users SET display_name = full_name WHERE display_name IS NULL;
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;

-- 000042_add_display_name_to_users.down.sql
ALTER TABLE users DROP COLUMN display_name;
```

### Node — Knex.js
```js
// migrations/20240326_add_display_name.js
exports.up = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.string('display_name', 255).nullable();
  });
  await knex('users').update('display_name', knex.raw('full_name'));
  // Note: Knex doesn't support adding NOT NULL safely in a single statement
  // Do this as a separate migration or use raw SQL
};

exports.down = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('display_name');
  });
};
```

---

## ROLLBACK PLAYBOOK

### Before any migration — always capture this:
```bash
# Snapshot schema + data (for large DBs, snapshot schema at minimum)
pg_dump --schema-only mydb > rollback_backup_$(date +%Y%m%d_%H%M%S).sql

# Point-in-time recovery target (PITR) — note the WAL position
psql -c "SELECT pg_backup_start('pre_migration_safety')"; 
```

### Rollback decision tree:
```
Did migration run but failed partway?
  → Check which steps completed (check migration tracking table)
  → If partial: manually revert only completed steps
  → If not applied: mark as rolled back and re-run

Did migration run fully but caused outage?
  → Stop writes to affected table
  → Restore from PITR or backup to pre-migration state
  → Coordinate with app team to deploy fix
  → Document in postmortem

Did migration succeed but need to undo?
  → Run the .down.sql / downgrade() immediately
  → Brief lock is acceptable if < 30 seconds
  → Monitor error rates during and after
```

### Lock timeout — prevent long holds:
```sql
-- Set lock timeout before risky operations (PostgreSQL)
SET lock_timeout = '5s';
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
-- If lock can't be acquired in 5s, query fails immediately instead of waiting forever
```

---

## MIGRATION HEALTH CHECK

```bash
# Check for locks held by migrations
SELECT pid, relation::regclass, mode, granted, query
FROM pg_locks l JOIN pg_stat_activity a ON l.pid = a.pid
WHERE state != 'idle'
ORDER BY l.granted, l.pid;

# Check long-running transactions (possible migration blockers)
SELECT pid, now() - xact_start AS duration, state, query
FROM pg_stat_activity
WHERE state != 'idle' AND xact_start IS NOT NULL
ORDER BY duration DESC;

# Check migration lock waits
SELECT blockee.pid AS blocked_pid, blocker.pid AS blocking_pid, blockee.query
FROM pg_stat_activity AS blockee
JOIN pg_locks AS blockl ON blockee.pid = blockl.pid AND NOT blockl.granted
JOIN pg_stat_activity AS blocker ON blockl.pid = blocker.pid;

# Verify migration history
SELECT version, description, applied_at FROM alembic_version ORDER BY applied_at DESC LIMIT 10;
SELECT * FROM schema_migrations ORDER BY version DESC LIMIT 10;
```

---

## Checklist Before Running Any Production Migration

- [ ] Migration tested on DB with representative data volume
- [ ] Rollback script written and tested
- [ ] Lock duration estimated (test on staging)
- [ ] Maintenance window communicated (if needed)
- [ ] Backup verified (can restore to pre-migration state)
- [ ] Monitoring/alerting on for: lock waits, query latency, error rate
- [ ] Go/no-go decision made with on-call engineer
- [ ] Post-migration verification query ready
