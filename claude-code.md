# Claude Code (2026-Era) Control Plane

Claude Code is the "Brain" of the 2026 developer stack, designed as a high-speed CLI agent and Control Plane. Unlike traditional chat interfaces, it operates on a **Model-Led OODA Loop** optimized for dense codebase context.

## The Claude Code Loop (ASCII Art)

```text
       [  USER REQUEST  ]
              │
    ┌─────────▼──────────┐
    │     OBSERVE        │ <─── [ CONTEXT COMPACTION ]
    └─────────┬──────────┘      LIFO pruning of irrelevant history.
              │
    ┌─────────▼──────────┐
    │     ORIENT         │ <─── [ CLAUDE.md / PROJECT BRAIN ]
    └─────────┬──────────┘      Reading architectural rules & invariants.
              │
    ┌─────────▼──────────┐
    │     DECIDE         │ <─── [ MCP TOOLS ]
    └───────┬───┬────────┘      Sourcing external state (PRs, Issues, DB).
            │   │
    ┌───────▼───▼────────┐      [ SURGICAL EDITING ]
    │       ACT          │ <─── [ OFFSET/LIMIT READS ]
    └───────┬───┬────────┘      Line-range reads to save 90% in tokens.
            │   │
    ┌───────▼───▼────────┐
    │     VALIDATE       │ <─── [ DETERMINISTIC GATES ]
    └─────────┬──────────┘      Tests/Linting must pass before exit.
              │
      [ LOOP UNTIL EXIT ]
```

## The 2026 Elite Dev Stack

In this architecture, components are specialized by their "Biological" role:

1.  **The Brain (Control Plane):** [Claude Code CLI](https://github.com/anthropic-ai/claude-code)
    *   *Role:* High-level orchestration, complex refactoring, and CI/CD interaction.
2.  **The Nervous System:** [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
    *   *Role:* The "Sensory Organ" connecting Claude to GitHub, Postgres, and Slack.
3.  **The Editor (Interface):** [Zed](https://zed.dev)
    *   *Role:* Low-latency Rust-based environment with native MCP transparency.
4.  **The Memory:** `CLAUDE.md`
    *   *Role:* The "Prefrontal Cortex" storing project-specific conventions and slash commands.

## Key Primitives

| Technique | Purpose | 2026 Impact |
| :--- | :--- | :--- |
| **Context Decommissioning** | Pruning old file context | Prevents "hallucination drift" in long sessions. |
| **Symbolic Indexing** | Jumping to AST nodes | Replaces 2024-era Vector RAG with exact lookups. |
| **Shadow Testing** | Hidden micro-tests | Validates code logic without surfacing noise to the user. |

---
*Created by [Hermes Agent](https://hermes-agent.nousresearch.com) for Dom (@DomEscobar)*
