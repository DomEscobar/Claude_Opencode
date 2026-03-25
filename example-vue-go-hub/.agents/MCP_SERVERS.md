# MCP Servers Reference

Recommended Model Context Protocol servers for this project.
Configure these in your tool's MCP settings (e.g. Cursor's `mcp.json`, Claude Code's `~/.claude/mcp_servers.json`).

## Recommended Servers

### Context7 -- Up-to-date library documentation
Prevents agents from hallucinating outdated APIs by fetching current, version-specific docs at query time.

**When it helps:** Any time you work with Vue, Chi, GORM, Tailwind, Pinia, or Vite APIs.

```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"]
  }
}
```

### Playwright -- Browser testing and automation
Test frontend changes visually. Interact with the running dev server, fill forms, click buttons, take screenshots.

**When it helps:** Verifying UI changes, testing user flows, debugging layout issues.

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

### GitHub -- PR and issue management
Create PRs, read issues, post review comments, check CI status directly from agent context.

**When it helps:** The code-review and incident-response skills benefit from reading issue context.

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token>"
    }
  }
}
```

### Sentry -- Error monitoring
Fetch real error traces, stack traces, and issue details. Powers the incident-response skill.

**When it helps:** Production debugging, incident response, understanding error patterns.

```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "@sentry/mcp-server@latest", "--access-token", "<your-sentry-token>"]
  }
}
```

### PostgreSQL -- Database introspection
Read schema definitions, verify migrations, inspect table structures. Useful when writing queries or migrations.

**When it helps:** The database-migration skill benefits from inspecting the live schema.

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/dbname"
    }
  }
}
```

## Setup Notes

- These are recommendations, not requirements. The project works without any MCP servers.
- Token values shown as `<your-token>` must be replaced with real credentials. Never commit real tokens.
- Each tool has its own MCP config location. Check your tool's documentation for where to place the config.
- Context7 is the most broadly useful -- it helps with every library in the stack.
