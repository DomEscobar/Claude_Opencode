# Enterprise Monolith Repository Structures

Research conducted: March 24, 2026
Repositories analyzed: GitLab, Discourse, Mastodon, Sentry, Mattermost

---

## 1. DISCOURSE (Ruby on Rails Monolith)
**GitHub:** https://github.com/discourse/discourse

### Top-Level Structure
```
discourse/
├── app/                    # Rails MVC application
│   ├── assets/            # CSS, JS, images
│   ├── controllers/       # HTTP controllers
│   ├── helpers/           # View helpers
│   ├── jobs/              # Background jobs
│   ├── mailers/           # Email mailers
│   ├── models/            # ActiveRecord models
│   ├── queries/           # Query objects
│   ├── serializers/       # JSON serializers
│   ├── services/          # Service objects (domain logic)
│   └── views/             # ERB templates
├── frontend/              # Ember.js frontend
│   ├── discourse/         # Main Ember app
│   ├── discourse-i18n/    # Internationalization
│   ├── discourse-markdown-it/
│   └── pretty-text/       # Markdown processing
├── lib/                   # Core libraries & domain modules
│   ├── auth/              # Authentication
│   ├── email/             # Email handling
│   ├── guardian/          # Authorization
│   ├── search/            # Search functionality
│   ├── site_settings/     # Configuration
│   └── tasks/             # Rake tasks
├── db/                    # Database
│   ├── migrate/           # Migrations
│   └── fixtures/          # Seed data
├── config/                # Rails configuration
├── spec/                  # RSpec tests
└── plugins/               # Plugin system
```

### AI/Agent Files
- `AI-AGENTS.md` - Main agent guide (symlinked as AGENTS.md, CLAUDE.md, GEMINI.md)
- `.agents/skills/` - Skill definitions
- `.claude/skills` -> `.skills/` (symlink)
- `.cursor/rules/` - Cursor IDE rules

### Agent Features
- Comprehensive service authoring skill (`.skills/discourse-service-authoring/SKILL.md`)
- Default "Architect mode" for detailed analysis
- Test patterns with `fab!` syntax and page objects
- Lint enforcement via `bin/lint`

---

## 2. GITLAB (Ruby on Rails Monolith)
**GitHub:** https://gitlab.com/gitlab-org/gitlab

### Top-Level Structure
```
gitlab/
├── app/                   # Rails application
│   ├── assets/            # Static assets
│   ├── channels/          # ActionCable channels
│   ├── components/        # View components
│   ├── controllers/       # HTTP controllers
│   ├── finders/           # Query finders
│   ├── graphql/           # GraphQL API
│   ├── helpers/           # View helpers
│   ├── mailers/           # Email mailers
│   ├── models/            # ActiveRecord models
│   ├── policies/          # Authorization policies
│   ├── presenters/        # View presenters
│   ├── serializers/       # JSON serializers
│   ├── services/          # Service objects
│   ├── uploaders/         # File uploaders
│   ├── validators/        # Custom validators
│   ├── views/             # ERB templates
│   └── workers/           # Sidekiq workers
├── ee/                    # Enterprise Edition code
├── lib/                   # Core libraries
│   ├── api/               # API helpers
│   ├── gitlab/            # GitLab core
│   ├── gitaly/            # Git storage client
│   ├── ci/                # CI/CD logic
│   └── search/            # Search implementations
├── db/                    # Database
│   ├── migrate/           # Migrations
│   └── fixtures/
├── doc/                   # Documentation (22 subdirs)
│   ├── api/
│   ├── development/
│   ├── administration/
│   └── user/
├── danger/                # Danger bot rules
├── spec/                  # RSpec tests
├── .gitlab/ci/            # CI/CD pipeline config
└── config/                # Rails configuration
```

### AI/Agent Files
- `.ai/AGENTS.md` - Main agent guide
- `.ai/git.md` - Git workflow guide
- `.ai/ci-cd.md` - CI/CD configuration guide (12,500+ lines of pipeline!)
- `.ai/testing.md` - Testing guide
- `.ai/code-style.md` - Code style guide
- `.ai/database.md` - Database guide
- `.ai/code-review.md` - Code review guide

### Nested Agent Files
- `ee/frontend_islands/AGENTS.md` - Frontend islands
- `workhorse/AGENTS.md` - Go proxy documentation
- `doc/AGENTS.md` - Documentation writing guide

---

## 3. MASTODON (Ruby on Rails Monolith)
**GitHub:** https://github.com/mastodon/mastodon

### Top-Level Structure
```
mastodon/
├── app/                   # Rails application
│   ├── chewy/             # Elasticsearch integration
│   ├── controllers/       # HTTP controllers
│   ├── helpers/           # View helpers
│   ├── inputs/            # Form inputs
│   ├── javascript/        # React/TypeScript frontend
│   ├── lib/               # App libraries
│   ├── mailers/           # Email mailers
│   ├── models/            # ActiveRecord models
│   ├── policies/          # Pundit policies
│   ├── presenters/        # View presenters
│   ├── serializers/       # JSON serializers
│   ├── services/          # Service objects
│   ├── validators/        # Custom validators
│   ├── views/             # ERB templates
│   └── workers/           # Sidekiq workers
├── lib/                   # Core libraries
│   ├── mastodon/          # Mastodon core
│   ├── tasks/             # Rake tasks
│   └── generators/        # Rails generators
├── db/                    # Database
│   ├── migrate/           # Migrations
│   ├── post_migrate/      # Post-deployment migrations
│   ├── seeds/             # Seed data
│   └── views/             # Database views
├── config/                # Configuration
├── spec/                  # RSpec tests
├── chart/                 # Helm chart for K8s
├── dist/                  # Distribution files
└── docs/                  # Documentation
```

### AI/Agent Files
- **None found** - No AGENTS.md, CLAUDE.md, .cursorrules, or similar files

---

## 4. SENTRY (Python/Django Monolith)
**GitHub:** https://github.com/getsentry/sentry

### Top-Level Structure
```
sentry/
├── src/sentry/            # Main Django application (~100+ domain modules!)
│   ├── api/               # REST API endpoints
│   ├── models/            # Django models
│   ├── tasks/             # Celery tasks
│   ├── integrations/      # Third-party integrations
│   ├── issues/            # Issue tracking
│   ├── web/               # Web views/middleware
│   ├── analytics/         # Analytics
│   ├── billing/           # Billing domain
│   ├── buffer/            # Event buffering
│   ├── cache/             # Caching
│   ├── consumers/         # Kafka consumers
│   ├── eventstore/        # Event storage
│   ├── ingest/            # Event ingestion
│   ├── relay/             # Relay protocol
│   ├── snuba/             # ClickHouse integration
│   ├── workflow_engine/   # Workflow automation
│   └── ... (100+ domains)
├── static/                # React frontend
│   └── app/              # Main React app
├── tests/                 # Python tests
├── fixtures/              # Test fixtures
├── devenv/                # Development setup
├── config/                # Configuration
└── migrations/             # Database migrations
```

### AI/Agent Files
- `AGENTS.md` - Main agent guide (7,774 bytes)
- `CLAUDE.md` - Symlink to @AGENTS.md
- `agents.toml` - Agent configuration
- `.agents/skills/` - 16 skill modules
  - `design-system/` - UI components
  - `generate-migration/` - DB migrations
  - `hybrid-cloud-rpc/` - RPC patterns
  - `lint-fix/`, `lint-new/` - Linting
  - `sentry-backend-bugs/` - Bug fixing
  - `sentry-security/` - Security patterns
  - etc.

- `.claude/settings.json` - Claude permissions (extensive allowlist)
- `.mcp.json` - MCP configuration
- `src/AGENTS.md` - Backend-specific guide
- `static/AGENTS.md` - Frontend-specific guide
- `tests/AGENTS.md` - Testing guide

### Nested Agent Features
- Hierarchical AGENTS.md files (root → src → tests)
- External skill imports via `agents.toml`:
  ```toml
  [[skills]]
  name = "*"
  source = "getsentry/skills"
  ```

---

## 5. MATTERMOST (Go/React Monolith)
**GitHub:** https://github.com/mattermost/mattermost

### Top-Level Structure
```
mattermost/
├── server/               # Go backend
│   ├── channels/         # Core channels logic
│   │   ├── api4/         # REST API v4
│   │   ├── app/          # Application layer
│   │   ├── db/           # Database layer
│   │   ├── store/        # Data store
│   │   ├── jobs/         # Background jobs
│   │   ├── web/          # Web handlers
│   │   └── wsapi/        # WebSocket API
│   ├── enterprise/       # Enterprise features
│   ├── cmd/              # CLI commands
│   ├── config/           # Configuration
│   ├── platform/        # Platform services
│   └── public/           # Public APIs
├── webapp/               # React frontend
│   ├── channels/         # Channel components
│   ├── platform/         # Platform components
│   └── scripts/          # Build scripts
├── api/                  # API definitions
├── e2e-tests/           # E2E tests
└── tools/               # Development tools
```

### AI/Agent Files
- `AGENTS.CLOUD.md` - Cloud development guide
- `.agents/skills/agent-browser/` - Agent browser skill
- `skills-lock.json` - Skills lockfile with hash verification

### Skills Configuration
```json
{
  "skills": {
    "agent-browser": {
      "source": "vercel-labs/agent-browser",
      "sourceType": "github",
      "computedHash": "..."
    }
  }
}
```

---

## AI/Agent File Patterns Observed

### File Naming Conventions
| Convention | Usage |
|------------|-------|
| `AGENTS.md` | Primary agent instructions (most common) |
| `AI-AGENTS.md` | Alternative naming (Discourse) |
| `CLAUDE.md` | Claude-specific (usually symlink to AGENTS.md) |
| `.ai/AGENTS.md` | GitLab's organized approach |
| `agents.toml` | Configuration file (Sentry, Mattermost) |

### Directory Structures
```
# Pattern 1: Root-level (Discourse, Sentry)
/AGENTS.md
/CLAUDE.md -> AGENTS.md
/.agents/skills/

# Pattern 2: Hidden directory (GitLab)
/.ai/AGENTS.md
/.ai/git.md
/.ai/ci-cd.md

# Pattern 3: Nested domain-specific (Sentry)
/AGENTS.md
/src/AGENTS.md
/tests/AGENTS.md
/static/AGENTS.md
```

### Skills Organization
```
.agents/skills/
├── SKILL.md              # Skill definition
├── design-system/
│   └── SKILL.md
├── generate-migration/
│   └── SKILL.md
└── ...
```

---

## Key Architectural Observations

### Rails Monoliths (GitLab, Discourse, Mastodon)
- Use `app/services/` for domain logic
- Use `app/models/` for ActiveRecord models
- Use `lib/` for shared/domain libraries
- Extensive background job infrastructure (Sidekiq workers)

### Python/Django Monolith (Sentry)
- Uses `src/sentry/` with 100+ domain modules
- Domain-based organization (`billing/`, `ingest/`, `analytics/`)
- Celery tasks in `tasks/` subdirectory
- Heavy use of nested AGENTS.md for domain guidance

### Go Monolith (Mattermost)
- Uses `server/channels/` for core application
- Separate `app/`, `store/`, `api4/` layers
- Enterprise features in separate `enterprise/` directory
- Frontend in separate `webapp/` directory

### Common Patterns
1. **Service Layer**: All monoliths use service objects for complex business logic
2. **Domain Organization**: Sentry shows most advanced domain-based structure
3. **Agent Support**: 4/5 repos have AI agent files (Mastodon is exception)
4. **Skills System**: Sentry has most sophisticated skills architecture
5. **Nested Documentation**: GitLab and Sentry use nested AGENTS.md for different contexts

---

## Summary

All five enterprise monoliths show mature, well-organized structures:

| Repository | Language | Agent Files | Skills | Nested Guides |
|------------|----------|-------------|--------|---------------|
| Discourse | Rails | Yes (AI-AGENTS.md) | 2 | No |
| GitLab | Rails | Yes (.ai/) | 0 | Yes (7 files) |
| Mastodon | Rails | No | 0 | No |
| Sentry | Python | Yes (AGENTS.md) | 16 | Yes (4 files) |
| Mattermost | Go | Yes (AGENTS.CLOUD.md) | 1 | No |

The AI agent file pattern is emerging as a standard, with `AGENTS.md` being the most common convention. Sentry demonstrates the most sophisticated implementation with hierarchical documentation and a full skills system.
