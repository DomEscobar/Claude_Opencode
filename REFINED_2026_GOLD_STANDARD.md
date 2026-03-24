# Refined 2026 Agentic Architecture: The "Nervous System" v2

This document represents the **Expert-Validated Gold Standard** for agentic alignment in 2026. Based on a critical re-evaluation of current industry leaders (Claude Code, Cursor, OpenCode), we have moved from **Static Flat Files** to **Scoped Retrieval-Augmented Alignment**.

---

## 1. The Core Alignment Stack (Refined)

We have consolidated the "Alignment Stack" to maximize **Prompt Caching** and minimize **Context Bloat**.

| Layer | Component | Implementation | Why? |
| :--- | :--- | :--- | :--- |
| **L0** | **Identity & Rules** | `CLAUDE.md` | **Mandatory.** Combined Project Brain + Philosophy. Static for caching hits. |
| **L1** | **Scoped Rules** | `.claude/rules/*.md` | **Task-Specific.** Only injected when editing files matching specific globs (Cursor-style). |
| **L2** | **Memory Hub** | **MCP Memory Server** | **Dynamic.** Replaces `MEMORY.md`. Uses semantic retrieval to avoid context flooding. |
| **L3** | **Strategy** | `AGENTS.md` | **Optional.** Used only for complex multi-agent delegation maps. |

---

## 2. Advanced Action Primitives

The "2024" way of editing code is dead. Use these 2026 primitives for **99% reliability**:

### [A] Search/Replace Blocks (Content-Addressed)
Stop using line numbers. Line numbers are fragile and break the moment the file shifts. Use **Search/Replace Blocks** (Aider-style):
*   **Advantage:** Resilient to concurrent edits. If the code moves, the block still finds it.

### [B] Architect/Editor Separation
For non-trivial changes, split the "Thinking" from the "Typing":
1.  **Architect Pass:** A high-level model (Sonnet/Opus) understands the codebase and writes a Natural Language **Execution Plan**.
2.  **Editor Pass:** A cheaper, faster model (DeepSeek/Haiku) takes the plan and applies the **Surgical Patches**.

### [C] Repo Maps (Input Optimization)
Don't dump entire files. Use **Tree-Sitter Repo Maps** to show the agent a skeleton of the classes/methods first. The agent "requests" full implementation only for the nodes it needs to edit.

---

## 3. Drift Mitigation: The "Janitor" Protocol

To prevent **Instruction Dilution** (where the agent forgets rules in long sessions), implement these 2026 guardrails:

1.  **Context Decommissioning:** Proactively use the `/compact` command to summarize old history.
2.  **Periodic Re-Injection:** Every 5-10 tool calls, the system should re-verify the core `CLAUDE.md` invariants.
3.  **Checkpointing:** Save "State Snapshots" in `/.agent/trajectories/` to allow for instant rollback of reasoning.

---

## 4. The 2026 Mastery Checklist

- [ ] **Eliminate SOUL.md:** Merge its unique tone/preferences into `CLAUDE.md`.
- [ ] **Adopt Scoped Rules:** Move directory-specific logic into `.claude/rules/`.
- [ ] **Switch Edit Format:** Enforce Search/Replace blocks over line-number patching.
- [ ] **Connect MCP Memory:** Transition from a flat `MEMORY.md` to a vector-retrieval MCP server.

---
*Validated by [Hermes Agent Mixture-of-Agents] for Dom (@DomEscobar) — v2.0 GA release*
