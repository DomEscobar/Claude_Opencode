# 2026 OpenCode Power-User Setup (v3.2.1 GA)

## 1. Custom Commands (`.opencode/config.yml`)
Commands are your "Agent Muscle Memory."

```yaml
commands:
  # Swarm Spawn (Parallel execution of task sub-agents)
  - name: swarm
    description: "Initialize parallel sub-agents for a batch of tasks"
    command: "opencode-swarm --concurrency {{count}} --goal '{{goal}}'"

  # Forensic Diff (Precision analysis for code reviews)
  - name: review-diff
    description: "Analyze logical changes with zero grep-noise"
    command: "git diff --unified=0 | ast-grep scan"

  # Pulse-Check (Simultaneous Health/Test/LSP)
  - name: pulse
    description: "Run parallel diagnostics (tests, lint, typecheck)"
    command: "go test ./... && golangci-lint run && staticcheck ./..."
```

---

## 2. Custom Agents (`.opencode/agents/`)
Specialized roles that partition the OODA loop.

### `swarm-master/AGENT.md`
- **Role:** Orchestrator.
- **Rules:** "Decompose complex requests into 3-5 sub-tasks. Assign each to a unique sub-agent. Collect results in `SESSION.md` before pruning."

### `forensic-debugger/AGENT.md`
- **Role:** Parallel-Diagnostic Auditor.
- **Rules:** "Ignore standard logs. Use `strace` or `dlv` (Go) to trace execution paths. Evidence must be attached to the final PR in ASCII table format."

---

## 3. Custom Agent Skills (`.opencode/skills/`)
Reusable "Neural Pathways" loaded via `skill`.

### `atomic-commit/SKILL.md`
- **Description:** "Automate structured Git commits with forensics."
- **Content:** "For every local Green-State, generate a commit. Trailer MUST include `Trace-ID: <id>` and `Repro-Cmd: <cmd>` to solve Amnesiac Engineering."

### `contract-enforce/SKILL.md`
- **Description:** "Mandatory Handshake verification before logic-patching."
- **Content:** "Read `models.go` first. If any function signature is missing a struct tag, stop and heal the schema before proceeding."

---

## 4. Custom Tools (`.opencode/tools/`)
Bridging OpenCode to the "Nervous System."

### `parallel_exec.ts`
```typescript
import { tool } from "@opencode-ai/plugin"
export default tool({
  description: "Execute a command across multiple directories simultaneously",
  args: {
    command: tool.schema.string().describe("Command to broadcast"),
    dirs: tool.schema.array(tool.schema.string()).describe("Target paths"),
  },
  async execute(args) {
    // Logic for parallel Promise execution
    return `Started ${args.command} in ${args.dirs.length} nodes.`
  },
})
```

**Location:** `/root/Claude_Opencode/opencode_power_setup.md`
**File Delivery:** MEDIA:/root/Claude_Opencode/opencode_power_setup.md
