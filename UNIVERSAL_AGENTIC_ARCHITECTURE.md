# Universal Agentic Architecture (2026 Standard)

This document provides a model-agnostic overview of the **"Nervous System" Architecture**—a high-order operational loop designed for autonomous agents (Claude Code, OpenCode, Aider, etc.) to maintain alignment and reliability on complex codebases.

---

## 1. The Universal Agentic Loop (OODA v2)

In 2026, we have moved beyond "Chatting" to a **Structured Feedback Loop**. The agent doesn't just guess; it **Senses, Orients, Decides, and Acts.**

```text
          [ TASK / BUG REPORT ]
                   │
    ┌──────────────▼──────────────┐
    │          OBSERVE            │ <─── [ SENSORY INPUT ]
    │ (MCP: Logs, PRs, DB State)  │      Gathering environment telemetry.
    └──────────────┬──────────────┘
                   │
    ┌──────────────▼──────────────┐
    │          ORIENT             │ <─── [ SPATIAL ALIGNMENT ]
    │ (CLAUDE.md / Scoped Rules)  │      Loading project-specific "Frontal Cortex".
    └──────────────┬──────────────┘
                   │
    ┌──────────────▼──────────┐      [ ARCHITECT PASS ]
    │         DECIDE          │ <─── [ STRATEGIC PLANNING ]
    │  (Create Execution Plan) │      Defining the "Surgical Path".
    └──────────────┬──────────┘
                   │
    ┌──────────────▼──────────┐      [ EDITOR PASS ]
    │           ACT           │ <─── [ SEARCH/REPLACE BLOCKS ]
    │ (Surgical Code Edits)   │      Executing O(1) content-addressed patches.
    └──────────────┬──────────┘
                   │
    ┌──────────────▼──────────────┐
    │         REFLECT             │ <─── [ VERIFICATION GATE ]
    │ (LSP / Shadow Micro-Tests)  │      Self-healing loop via environment feedback.
    └──────────────┬──────────────┘
                   │
           [ TASK RESOLVED ]
```

---

## 2. Structural Overview: The Hierarchy of Truth

To prevent "Agent Drift," we organize project knowledge into a **Hierarchy of Truth**. This ensures the agent is only as smart as it needs to be for the current sub-task.

| Layer | Component | Implementation | Biological Role |
| :--- | :--- | :--- | :--- |
| **L0** | **Identity** | `PREAMBLE` (in root file) | The **Soul**: Vibe, Tone, Personal Preferences. |
| **L1** | **Global Rules** | `CLAUDE.md` / `PROJECT.md` | The **Brain**: Global invariants, Build/Test commands. |
| **L2** | **Scoped Rules** | `.agent/rules/*.md` | **Local Reflex**: Instructions that only load for specific folders. |
| **L3** | **Memory** | **MCP Retrieval** | **Long-term Memory**: Past lessons retrieved via Semantic Search. |

---

## 3. The 2026 "Action Primitives" (Universal)

Regardless of the model (Claude, GPT, Gemini, Llama), these three techniques define an **Elite Agentic Workflow**:

### A. Search/Replace Blocks (Not Line Numbers)
Agents should **never** edit by line number. Line numbers change as files grow. 
*   **The Standard:** Use "Search/Replace" blocks that find a unique string and swap it. This is **Content-Addressed** and resilient to concurrent edits.

### B. Repo Mapping (AST Skeletons)
The agent should not read all files in full.
*   **The Standard:** Use a "Repo Map" (Tree-Sitter based) to show the agent the "Skeleton" of the code first. It only "Requests" the full meat of the file when it's ready to edit.

### C. Shadow Testing (Environment Reflection)
The agent's job doesn't end when the code is saved.
*   **The Standard:** The agent triggers an automated "Shadow Test" (a hidden micro-test) and checks the Language Server (LSP) for new errors. It only reports "Done" once the environment reflects success.

---

## 4. Why This Architecture Wins

1.  **Context Efficiency:** Scoped rules and Repo Maps save 70% in token costs.
2.  **Reliability:** Shadow Testing and Search/Replace blocks eliminate "Hallucination Drift."
3.  **Model Agnostic:** This structure works for any frontier model with tool-calling capabilities.

---
*Created by [Hermes Agent] for Dom (@DomEscobar) — The Model-Agnostic 2026 Standard*
