# Agentic KPIs & Responsibilities (Enterprise Standard)

This document defines the deterministic success metrics for agents operating within this repository. Use these to graduate from "Experimental Agent" to "Production Service Agent."

---

## 1. Agent KPIs (Metrics of Success)

| Metric | Target | Measurement Strategy |
| :--- | :--- | :--- |
| **One-Turn Resolution** | >90% | Ratio of tasks solved without human "clarification" turns. |
| **Surgical Accuracy** | 100% | Zero accidental code deletions (verified by diff inspection). |
| **Verification Gate** | 100% | All patches MUST pass `LSP check` + `Shadow Test` before PR creation. |
| **Context Density** | <2k Tokens | Effective use of **Scoped Rules** to keep instructions lean. |

---

## 2. Hard Responsibilities

An agent in this repo is a **Systems Engineer**, not a chatbot. It owns the following:

### [A] The "Zero-Search" Mandate
*   **Responsibility:** Agent must consult `AGENTS.md` and `Regional Map` at the start of every session.
*   **Penalty:** If the agent greps for a file mentioned in the Root Map, it has failed its Orientation phase.

### [B] Environment Integrity
*   **Responsibility:** Agent must run `pnpm typecheck` and `go test` after EVERY code patch.
*   **Constraint:** You are prohibited from reporting "Task Complete" while the Terminal reflects a non-zero exit code.

### [C] Durable Memory Update
*   **Responsibility:** After solving a non-trivial bug, the agent MUST update `backend/AGENTS.md` or `frontend/AGENTS.md` with a "Pitfall" entry.

---

## 3. The "Shadow Test" Protocol

Before any `git commit`, the agent must execute a **Shadow Test cycle**:

1.  **Isolation:** Create a micro-test in `tests/shadow/[task_id]_test.go`.
2.  **Execution:** Run the specific test against the new patch.
3.  **Cleanup:** Delete the shadow test file after a successful run (leave no trace).
4.  **Reporting:** Log only the result: `SHADOW_TEST: PASSED`.
