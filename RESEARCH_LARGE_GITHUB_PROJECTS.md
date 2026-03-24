# Large GitHub Projects - AI Agent Files Research Summary

## Executive Summary

Researched 10 large enterprise/open-source projects. Successfully cloned and analyzed 8 public repositories. Found AI agent-related files in 4 of them.

### Repository Access Status

| Repository | Status | AI Agent Files |
|------------|--------|----------------|
| shopify/shopify | PRIVATE | N/A |
| github/github | PRIVATE | N/A |
| kubernetes/kubernetes | PUBLIC (29K+ files) | None found |
| prometheus/prometheus | PUBLIC | **AGENTS.md, CLAUDE.md** |
| grafana/grafana | PUBLIC (21K+ files) | **AGENTS.md, CLAUDE.md, directory-scoped AGENTS.md** |
| microsoft/vscode | PUBLIC (10K+ files) | **AGENTS.md, .agents/ directory** |
| elastic/elasticsearch | PUBLIC (39K+ files) | **AGENTS.md** |
| rails/rails | PUBLIC | None found |
| django/django | PUBLIC | None found |
| gitlab-org/gitlab-runner | PUBLIC | None found |

---

## 1. PROMETHEUS (prometheus/prometheus)
**GitHub**: https://github.com/prometheus/prometheus
**Language**: Go
**Size**: ~2,500 files

### Directory Structure (Top Level)
```
prometheus/
├── cmd/              # Main applications (prometheus, promtool)
├── compliance/       # Compliance tests
├── config/           # Configuration handling
├── discovery/        # Service discovery mechanisms
├── docs/             # Documentation
├── documentation/    # User documentation
├── internal/         # Internal packages
├── model/            # Data models
├── notifier/         # Alertmanager integration
├── plugins/          # Plugin system
├── prompb/           # Protobuf definitions
├── promql/           # Query language parser/engine
├── rules/            # Alerting/recording rules
├── schema/           # Schema definitions
├── scrape/           # Scraping logic
├── scripts/          # Build/deploy scripts
├── storage/          # Storage layer
├── template/         # Template expansion
├── tracing/          # Distributed tracing
└── tsdb/             # Time series database
```

### AI Agent Files Found
- **AGENTS.md** - Comprehensive contributor guidance
- **CLAUDE.md** - Symlink to AGENTS.md

### Key Patterns from AGENTS.md
- PR title format: `area: short description` (e.g., `tsdb/wlog: optimize WAL watcher reads`)
- Common area prefixes: `tsdb`, `promql`, `discovery/<name>`, `agent`, `alerting`
- Release notes block required in every PR
- Performance work requires benchmarks with `benchstat` output
- Sign off commits with `git commit -s` for DCO

---

## 2. GRAFANA (grafana/grafana)
**GitHub**: https://github.com/grafana/grafana
**Language**: Go (backend) + TypeScript/React (frontend)
**Size**: ~21,000 files

### Directory Structure (Top Level)
```
grafana/
├── apps/             # Standalone Go apps (dashboard, alerting, folder)
├── conf/             # Configuration files
├── contribute/       # Contribution guides
├── devenv/           # Development environment setup
├── docs/             # Documentation source
├── e2e/             # E2E tests
├── e2e-playwright/   # Playwright E2E tests
├── emails/           # Email templates
├── grafana-mixin/    # Grafana dashboards/alerts for Grafana
├── hack/             # Development scripts
├── kinds/            # CUE schema definitions
├── local/            # Local development configs
├── packages/         # Shared packages (@grafana/data, @grafana/ui, etc.)
├── packaging/        # Distribution packaging
├── pkg/              # Go backend code
│   ├── api/          # HTTP handlers
│   ├── services/     # Business logic by domain
│   ├── server/       # Server init & Wire DI
│   ├── tsdb/         # Data source backends
│   ├── plugins/      # Plugin system
│   └── infra/        # Logging, metrics, DB access
├── public/           # Frontend code
│   └── app/
│       ├── core/     # Shared components/services
│       ├── features/ # Feature code by domain
│       ├── plugins/  # Built-in plugins
│       └── store/    # Redux store
└── tools/            # Development tools
```

### AI Agent Files Found
- **AGENTS.md** - Main project guidance
- **CLAUDE.md** - Symlink to AGENTS.md
- **docs/AGENTS.md** - Documentation style guide
- **public/app/features/alerting/unified/AGENTS.md** - Alerting squad patterns
- **e2e-playwright/plugin-e2e/plugin-e2e-api-tests/AGENTS.md** - E2E test patterns

### Key Patterns from AGENTS.md
- Wire DI for backend (regenerate with `make gen-go`)
- CUE schemas in `kinds/` generate Go and TS code
- Feature toggles in `pkg/services/featuremgmt/`
- Separate PRs for frontend/backend (different deployment cadences)
- RTK Query for data fetching (not plain Redux)
- Directory-scoped AGENTS.md for specialized areas

---

## 3. VS CODE (microsoft/vscode)
**GitHub**: https://github.com/microsoft/vscode
**Language**: TypeScript
**Size**: ~10,000 files

### Directory Structure (Top Level)
```
vscode/
├── .agents/          # AI agent skills directory
│   └── skills/
│       └── launch/   # VS Code automation skill
│           └── SKILL.md
├── build/            # Build scripts and CI/CD
├── cli/              # CLI implementation
├── extensions/       # Built-in extensions
│   ├── git/
│   ├── typescript-language-features/
│   ├── html-language-features/
│   └── ... (language support, themes, tools)
├── remote/           # Remote development
├── resources/        # Static resources (icons, themes)
├── scripts/          # Development scripts
├── src/              # Main TypeScript source
│   ├── vs/
│   │   ├── base/     # Foundation utilities
│   │   ├── platform/ # Platform services & DI
│   │   ├── editor/   # Text editor (Monaco)
│   │   ├── workbench/ # Main application UI
│   │   ├── code/     # Electron main process
│   │   ├── server/   # Server implementation
│   │   └── sessions/ # Agent sessions window
│   └── vscode-dts/   # VS Code API definitions
└── test/             # Integration tests
```

### AI Agent Files Found
- **AGENTS.md** - Project guidance
- **.agents/skills/launch/SKILL.md** - VS Code automation skill (agent-browser)
- **.github/copilot-instructions.md** - Detailed Copilot instructions

### Key Patterns from AGENTS.md
- Layered architecture: base → platform → editor → workbench
- Dependency injection through constructor parameters
- Contribution model for features
- Tabs for indentation (not spaces)
- Externalize all user-visible strings via `vs/nls`

---

## 4. ELASTICSEARCH (elastic/elasticsearch)
**GitHub**: https://github.com/elastic/elasticsearch
**Language**: Java
**Size**: ~39,000 files

### Directory Structure (Top Level)
```
elasticsearch/
├── benchmarks/       # Performance benchmarks
├── build-conventions/ # Gradle build conventions
├── build-tools/      # Build tools
├── client/           # Java client
├── dev-tools/        # Development tools
├── distribution/     # Distribution packaging
├── docs/             # Documentation
├── gradle/           # Gradle wrapper
├── libs/             # Internal libraries
├── licenses/         # License files
├── modules/          # Core modules shipped by default
│   ├── aggregations/
│   ├── analysis-common/
│   ├── data-streams/
│   ├── ingest-common/
│   └── ...
├── plugins/          # Officially supported plugins
├── qa/               # Integration tests
├── rest-api-spec/    # REST API specification
├── server/           # Core server code
├── test/             # Test infrastructure
└── x-pack/           # Elastic License features
    ├── plugin/       # X-Pack plugins
    ├── libs/         # X-Pack libraries
    └── qa/           # X-Pack QA tests
```

### AI Agent Files Found
- **AGENTS.md** - Comprehensive build/test/code guidance

### Key Patterns from AGENTS.md
- Gradle composite build with conventions
- Test types: Unit (ESTestCase), Single Node (ESSingleNodeTestCase), Integration (ESIntegTestCase)
- YAML REST tests preferred for API testing
- No wildcard imports; use parameterized logging
- REST handlers: `Rest*Action` pattern
- Transport: `Transport*Action` classes
- License headers differ between main repo and x-pack

---

## 5. KUBERNETES (kubernetes/kubernetes)
**GitHub**: https://github.com/kubernetes/kubernetes
**Language**: Go
**Size**: ~29,000 files

### Directory Structure (Top Level)
```
kubernetes/
├── api/              # API definitions
├── build/            # Build scripts
├── CHANGELOG/        # Changelog files
├── cluster/          # Cluster deployment configs
├── cmd/              # Main applications
│   ├── kube-apiserver/
│   ├── kube-controller-manager/
│   ├── kubelet/
│   └── ...
├── docs/             # Documentation
├── hack/             # Development scripts
├── LICENSES/         # License files
├── logo/             # Project logo
├── pkg/              # Main Go packages
│   ├── admission/
│   ├── apis/
│   ├── controller/
│   ├── kubeapiserver/
│   └── ...
├── plugin/           # Plugins
├── staging/          # Staging repositories
├── test/             # Test suites
├── third_party/      # Third-party code
└── vendor/           # Vendored dependencies
```

### AI Agent Files Found
None. Has CONTRIBUTING.md but no AI-specific files.

### Domain Organization Pattern
- `cmd/` - Entry points for each binary
- `pkg/` - Domain-organized packages (admission, controller, apis, etc.)
- `staging/` - Submodules for separate release
- `api/` - OpenAPI specifications

---

## 6. RAILS (rails/rails)
**GitHub**: https://github.com/rails/rails
**Language**: Ruby
**Size**: ~5,000 files

### Directory Structure (Top Level)
```
rails/
├── actioncable/      # WebSocket support
├── actionmailbox/    # Email routing
├── actionmailer/     # Email sending
├── actionpack/       # Controller & routing
├── actiontext/       # Rich text editing
├── actionview/       # View templates
├── activejob/        # Job framework
├── activemodel/      # Model validation
├── activerecord/     # ORM
├── activestorage/    # File uploads
├── activesupport/    # Ruby extensions
├── guides/           # Documentation
├── railties/         # Engine & CLI
├── tasks/            # Rake tasks
└── tools/            # Development tools
```

### AI Agent Files Found
None. Has CONTRIBUTING.md but no AI-specific files.

### Domain Organization Pattern
Each Rails component is a separate gem in its own directory.

---

## 7. DJANGO (django/django)
**GitHub**: https://github.com/django/django
**Language**: Python
**Size**: ~3,000 files

### Directory Structure (Top Level)
```
django/
├── django/           # Main framework
│   ├── apps/         # App registry
│   ├── conf/         # Configuration
│   ├── contrib/      # Contrib apps (admin, auth, etc.)
│   ├── core/         # Core utilities
│   ├── db/           # Database layer
│   ├── forms/        # Form handling
│   ├── http/         # HTTP handling
│   ├── middleware/   # Middleware
│   ├── template/     # Template engine
│   ├── test/         # Testing utilities
│   ├── urls/         # URL routing
│   └── views/        # Views
├── docs/             # Documentation
├── extras/           # Extra utilities
├── js_tests/         # JavaScript tests
├── scripts/          # Scripts
└── tests/            # Test suite
```

### AI Agent Files Found
None. Has CONTRIBUTING.rst but no AI-specific files.

---

## 8. GITLAB RUNNER (gitlab-org/gitlab-runner)
**GitHub**: https://gitlab.com/gitlab-org/gitlab-runner
**Language**: Go
**Size**: ~1,500 files

### Directory Structure (Top Level)
```
gitlab-runner/
├── apps/             # Application code
├── cache/            # Cache handling
├── commands/         # CLI commands
├── common/           # Shared code
├── dockerfiles/      # Docker images
├── docs/             # Documentation
├── executors/        # Job executors
├── helpers/          # Helper utilities
├── log/              # Logging
├── network/          # Network handling
├── packaging/        # Distribution
├── shells/           # Shell integration
├── steps/            # Job steps
└── tests/            # Test suite
```

### AI Agent Files Found
None. Has CONTRIBUTING.md but no AI-specific files.

---

## AI Agent File Patterns Summary

### File Types Found
| File | Purpose |
|------|---------|
| AGENTS.md | Primary AI agent guidance file |
| CLAUDE.md | Claude-specific instructions (often symlink to AGENTS.md) |
| .agents/ | Directory containing skill definitions |
| .github/copilot-instructions.md | GitHub Copilot instructions |
| docs/AGENTS.md | Documentation-specific agent guidance |

### Common Patterns in AGENTS.md Files

1. **Project Overview**: Brief description of what the project is
2. **Commands Section**: Build, test, lint commands
3. **Architecture**: Key directories and their purposes
4. **Principles**: Core coding principles
5. **Testing Guidelines**: How to write and run tests
6. **Style Guidelines**: Code style and formatting rules
7. **PR/Commit Guidelines**: Title format, commit signing, etc.

### Symlink Pattern
Several projects use `CLAUDE.md` as a symlink to `AGENTS.md`:
```
CLAUDE.md → AGENTS.md
```

This allows maintaining a single source of truth while supporting multiple AI agent tools.

---

## Key Findings

1. **4 out of 8 public repos have AI agent files** (50% adoption among large projects)
2. **Grafana has the most sophisticated setup** with:
   - Root AGENTS.md
   - Directory-scoped AGENTS.md files for specialized areas
   - Documentation-specific guidance
3. **VS Code has a unique .agents/ directory** with skill definitions for automation
4. **Prometheus and Grafana use the symlink pattern** (CLAUDE.md → AGENTS.md)
5. **Older/more traditional frameworks** (Rails, Django) don't have AI agent files
6. **All AI agent files focus on practical guidance**: commands, architecture, testing, style

---

## GitHub Links

- Prometheus: https://github.com/prometheus/prometheus
- Grafana: https://github.com/grafana/grafana
- VS Code: https://github.com/microsoft/vscode
- Elasticsearch: https://github.com/elastic/elasticsearch
- Kubernetes: https://github.com/kubernetes/kubernetes
- Rails: https://github.com/rails/rails
- Django: https://github.com/django/django
- GitLab Runner: https://gitlab.com/gitlab-org/gitlab-runner
