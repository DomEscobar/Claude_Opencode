# OpenCode Mastery Roadmap: From Chat to Agentic Runtime

This guide is designed to take developers from "Chatting with AI" (2024) to "Orchestrating Agentic Runtimes" (2026) using OpenCode.

---

## 🟢 PHASE 1: The Sensory Organs (MCP Integration)
**Goal:** Connect the agent to the real world. Stop copy-pasting code into a chat window.

### 1.1 Connect the First Peripheral
Learn to use MCP (Model Context Protocol) to let the agent "sense" your environment.
*   **Step:** Install and configure a GitHub MCP server.
*   **Skill:** Use `/mcp` to list active "sensory organs."
*   **Example:** 
    > "Check the latest 3 issues on my repo and tell me which one involves a memory leak."
    *   *Result:* Agent calls `github_get_issue` instead of asking you for a link.

### 1.2 Multi-Sensory Decisions
Combine tools to make cross-platform decisions.
*   **Example:**
    > "Find the failing logs in Sentry, then search the codebase for the function name mentioned in the stack trace."

---

## 🟡 PHASE 2: Muscle Memory (Skill Creation)
**Goal:** Automate complex, recurring logic so the agent doesn't have to "think" (expensive) every time.

### 2.1 Identify the Pattern
When you find yourself giving the same 5 instructions repeatedly, it's time to build a Skill.
*   **Step:** Use `/skill_manage create` to pre-record a workflow.
*   **The Roadmap:** 
    1. Perform task manually once.
    2. Document successful commands.
    3. Save as a `.md` skill in `~/.hermes/skills/`.

### 2.2 Pre-compiled Hardened Workflows (PHWs)
*   **Example:** Create a `security-audit` skill.
    *   *Instruction:* "Run `npm audit`, grep for High vuln, and use Concrete Patching to update the specific sub-dependency."
    *   *Result:* Next time, just say `/security-audit`. No reasoning required.

---

## 🟠 PHASE 3: Surgical Action (Concrete Patching)
**Goal:** Master the "O(1) Edit." Stop rewriting files; start swapping AST nodes.

### 3.1 Trust the Tree-Sitter
Learn to use structural search (ast-grep) instead of fuzzy text search.
*   **Step:** Force the agent to use `patch` instead of `write_file`.
*   **Example:**
    > "Replace the return type of all functions in `src/utils` from `any` to `unknown` using a patch."
    *   *Result:* Zero hallucination drift. No deleted comments.

---

## 🔴 PHASE 4: The Closed Loop (Reflection)
**Goal:** Self-healing agents. The agent shouldn't tell you it's done until it *knows* it's done.

### 4.1 Shadow Testing
Implement "Verification Gates" that run automatically after an edit.
*   **Step:** Define a `SHADOW_TEST.md` in your project root.
*   **Example:**
    > "After you patch the auth logic, run the `/validate` skill which executes `vitest` and checks the LSP for new red squiggles."

### 4.2 Diagnostic Loops
*   **Behavior:** If the Shadow Test fails, the agent enters a "Diagnostic Loop" (Sequential ReAct) to fix the error *before* surfacing it to you.

---

## 💎 THE 2026 OUTREACH HOOK
**"In 2024, you wrote the code. In 2026, you write the Nervous System that writes the code."**

### Master Example (The One-Turn Resolution)
> "Dom, check my Linear tickets for the highest priority bug, reproduce it with a test, fix it with a surgical patch, and push the PR if the CI is green."

*   **Sensing:** MCP (Linear + GitHub)
*   **Deciding:** Skill Registry (Bug-fix workflow)
*   **Acting:** Concrete Patching (AST Edit)
*   **Reflecting:** LSP + Shadow Tests

---
*Created by [Hermes Agent](https://hermes-agent.nousresearch.com) for DomEscobar*
