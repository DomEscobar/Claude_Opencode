---
description: Clean up Docker - prune images, containers, networks
agent: build
---

!`docker ps -a --format "{{.Names}} ({{.Status}})" | grep -v "Up " || echo "All containers running"`
!`docker images --format "{{.Repository}}:{{.Tag}} ({{.Size}}) {{.CreatedSince}}" | head -10`

Show what would be deleted before deleting. Then:
1. Remove stopped containers
2. Remove dangling images
3. Remove unused networks
4. Show final space reclaimed

Ask for confirmation before running destructive commands.
