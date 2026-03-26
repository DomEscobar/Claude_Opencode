# OpenCode Agentic Loop (2026-Era)

This document outlines the "Nervous System" architecture of the [OpenCode](https://github.com/anomalyco/opencode) agent, specifically how it integrates **Skills** and **MCP** for high-order resolution.

## The Loop Architecture (OODA/ReAct Enhanced)

Instead of a generic chat loop, OpenCode implements a four-stage nervous system that prioritizes "zero-search" jumps and surgical edits.

### 1. The Nervous System Flow (ASCII Art)

```text
       [  USER REQUEST  ]
              │
      ┌───────▼────────┐
      │  ORIENTATION   │ <─── [ SYMDEX / EXECUTIVE GREPPING ]
      └───────┬────────┘      Sensing the codebase geometry.
              │
      ┌───────▼────────┐
      │    DECIDE      │ <─── [ SKILL REGISTRY ]
      └───────┬────────┘      Loading "Muscle Memory" (Pre-compiled Workflows).
              │               [ MCP ] 
              │               Accessing external environment state.
              │
      ┌───────▼────────┐
      │      ACT       │ <─── [ CONCRETE PATCHING ]
      └───────┬────────┘      Surgical AST-node edits (O(1) approach).
              │
      ┌───────▼────────┐
      │    REFLECT     │ <─── [ LSP FEEDBACK / SHADOW TESTS ]
      └───────┬────────┘      Environment-reflection for validation.
              │
      [ LOOP UNTIL RESOLVED ]
```

## Prompt Layering & Injection

To maintain cache efficiency, the agent separates its "Procedural Memory" from its core "System Identity."

| Layer | Component | Injection Point | Source |
| :--- | :--- | :--- | :--- |
| **L0** | Identity | System Prompt | `src/agent/index.ts` |
| **L1** | Skills | **User Message** | `src/skill/index.ts` |
| **L2** | State | Tool Outputs | `src/mcp/index.ts` |
| **L3** | Context | Active Code Block | `src/patch/index.ts` |

## Technical Deep-Links (Repo Reference)

The "Nervous System" is implemented across these core modules:

### [1] The Sensory Organs (MCP)
How the agent senses the external environment (GitHub, Slack, Databases).
*   **Main Logic:** [src/mcp/index.ts](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/mcp/index.ts)
*   **Auth Handlers:** [src/mcp/auth.ts](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/mcp/auth.ts)

### [2] The Muscle Memory (Skills)
Pre-recorded procedural blocks that bypass expensive reasoning.
*   **Skill Registry:** [src/skill/index.ts](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/skill/index.ts)

### [3] Surgical Action (Concrete Patching)
AST-based editing that eliminates file-rewrite hallucinations.
*   **Patch Logic:** [src/patch/index.ts](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/patch/index.ts)

### [4] Diagnostic Feedback (LSP Reflection)
Closing the loop by verifying with Language Servers.
*   **LSP Reflection:** [src/lsp/index.ts](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts)

### [5] The Core Loop (Orchestration)
The central ReAct engine.
*   **Agent Engine:** [src/agent/index.ts](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/agent/index.ts)

---
*Created by [Hermes Agent](https://hermes-agent.nousresearch.com) for Dom (@DomEscobar)*
