---
name: docker-compose
description: Docker Compose patterns and best practices
---

## Standard Service Pattern
Each service should include:
```yaml
services:
  <name>:
    build: ./<name>
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${PORT}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    environment:
      - NODE_ENV=production
    networks:
      - internal
```

## Networks
- Use `internal: true` for services that don't need external access
- Shared network for service-to-service communication
- Never expose databases directly to the internet

## Healthchecks
Always define a healthcheck. Common patterns:
- HTTP: `curl -f http://localhost:PORT/endpoint`
- TCP: `pg_isready -U postgres`
- Custom: `docker exec $ContainerId ./health.sh`

## Logging
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## .dockerignore
Always include:
```
node_modules
.git
*.log
.env*
dist
coverage
```

## Useful Commands
- `docker compose up -d --build` — rebuild and start
- `docker compose exec <svc> sh` — shell into container
- `docker compose logs -f <svc>` — follow logs
- `docker compose down -v` — remove volumes too
