# Tutorial Series: Building your first 2026-Era "Agentic Nervous System"

This series walks you through the step-by-step transformation of a "Static Codebase" into a "Responsive Agentic Runtime" using the Hierarchical Alignment Stack.

---

## 🟢 LESSON 1: The "Frontal Cortex" (CLAUDE.md)
**Goal:** Prevent your agent from asking "How do I run tests?" ever again.

### The Problem: "Context Amnesia"
Agents wake up in a new repo with zero memory of your build tools or coding preferences. They waste 500-1000 tokens just "figuring out" your environment.

### The Solution:
1.  **Create `/CLAUDE.md`** in your root directory.
2.  **Add the "Project Brain" basics:**
    *   Build commands: `npm run build`
    *   Test commands: `npm test -- [file]`
    *   Linting: `npm run lint`
3.  **Add "Architectural Invariants":**
    *   *Example:* "We use Zod for all validation; never use raw types."

---

## 🟡 LESSON 2: The "Spatial Index" (AGENTS.md)
**Goal:** Stop the agent from "Grepping" and start "Jumping."

### The Problem: "The Search Hole"
On large projects, the agent spends 80% of its budget searching for the right file. This is slow and expensive.

### The Solution:
1.  **Create `/.agent/AGENTS.md`.**
2.  **Define the "Map":**
    *   Map High-Level Features -> File Paths.
    *   *Example:* "Payments logic is in `src/handlers/pay.ts`. Do not touch `src/handlers/legacy_pay.ts`."
3.  **Define "Verification Gates":**
    *   *Rule:* "Always run `/verify-patch` after any edit to `src/auth`."

---

## 🟠 LESSON 3: The "Muscle Memory" (Local Skills)
**Goal:** Automate complex, multi-tool sequences into a single command.

### The Problem: "Reasoning Fatigue"
Long reasoning chains increase the chance of errors. If you've explained how to fix a bug twice, you've explained it too many times.

### The Solution:
1.  **Create `/.hermes/skills/` folder.**
2.  **Write your first Skill: `systematic-debugging.md`**
    *   *Steps:* (1) Grep logs -> (2) Create reproduction test -> (3) Apply patch -> (4) Run test.
3.  **Execute:** Simply type `/systematic-debugging [error_message]`.

---

## 🔴 LESSON 4: The "Sensory Organ" (MCP Connection)
**Goal:** Give the agent "Eyes" beyond the terminal.

### The Problem: "The Information Silo"
The agent doesn't know about failing CI/CD logs or customer bug reports in GitHub Issues unless you copy-paste them.

### The Solution:
1.  **Configure `mcp.json`.**
2.  **Connect the GitHub MCP server.**
3.  **Assign the Responsibility:**
    *   *Command:* "Check GitHub for the latest open issue labeled 'P0', read its logs from Sentry via MCP, and begin the `systematic-debugging` skill."

---

## 💎 GRADUATION TASK: The Master Turn
If you've followed Lesson 1–4, you can now issue the **"Zero-Friction"** command:

> "Hermes, fix the regression in our auth module that Sentry flagged this morning. Use our security-audit skill and update MEMORY.md once the tests pass."

---
*Created by [Hermes Agent](https://hermes-agent.nousresearch.com) for Dom (@DomEscobar) — Pushed to GitHub*
