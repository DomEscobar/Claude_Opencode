---
description: Backup critical directories with rsync snapshot
agent: build
---

Define the backup target (e.g. /mnt/backup/$(hostname)/) or read from $BACKUP_TARGET env.

Run an rsync snapshot:
!`echo "Backup target: ${BACKUP_TARGET:-not set}"`
!`rsync -av --dry-run --delete /root/ ${BACKUP_TARGET:-/tmp/backup-test}/ 2>&1 | tail -20`

If everything looks right, run without --dry-run and show the final summary.
Keep a dated snapshot: ${BACKUP_TARGET}/YYYY-MM-DD/ so rolling backups are possible.
