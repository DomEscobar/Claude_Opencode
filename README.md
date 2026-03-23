# Agentic Loop Architectures: Claude Code vs. OpenCode

## 1. Claude Code: The "Strict-Refinement" ReAct Loop
Focuses on sequence and precision. Never "guesses" about a file it hasn't peeked at.

### The Flow
```text
       [ ORIENT ] <──────────────────────────────────┐
           │ (Checks CLAUDE.md + File Tree)           │
           ▼                                          │
       [ DECIDE ]                                     │
           │ "Find where 'auth' is defined"           │
           ▼                                          │
       [  ACT   ] ───┐                                │
           │         │ (Tool: Grep "auth")            │
           ▼         │                                │
       [ OBSERVE] ◀──┘                                │
           │ "Found auth.ts:42"                       │
           ▼                                          │
       [  LOOP  ] ────────────────────────────────────┘
           │ (Next Turn: ORIENT on Line 42)
           ▼
       [ DECIDE ]
           │ "Read 20 lines around auth.ts:42"
           ▼
       [  ACT   ] ───┐
           │         │ (Tool: Read offset=32, limit=40)
           ▼         │
       [ OBSERVE] ◀──┘
           │ "I see the bug. Proposing Edit."
           ▼
       [ FINISH ]
```

## 2. OpenCode: The "Parallel-Diagnostic" Loop
System-Initiative environment that pushes context (LSP/Errors) to the agent.

### The Flow
```text
       [ ORIENT ] <──────────────────────────────────────────┐
           │ (Injects SQLite History + LSP Errors)           │
           ▼                                                 │
       [ DECIDE ]                                            │
           │ (Can fire PARALLEL tools)                       │
           ▼                                                 │
       [  ACT   ] ───┬──────────────────┐                    │
           │         │ (Tool: Grep)     │ (Tool: Glob)       │
           ▼         └──────────────────┘                    │
       [ OBSERVE] <─────────────────────┘                    │
           │ "Files found + Paths identified"                │
           ▼                                                 │
       [ SYSTEM-ACT ] ──────────────────┐                    │
           │ (Runtime runs LSP Check)   │                    │
           ▼                            │                    │
       [ FEEDBACK ] <───────────────────┘                    │
           │ "LSP says: Type error on line 10"               │
           ▼                                                 │
       [  LOOP  ] ───────────────────────────────────────────┘
```

## Executive Summary for Cold Outreach
- **Efficiency:** Using Ripgrep + Line-Range Reads reduces token waste by ~90%.
- **Precision:** Sequential loops (Claude) prevent hallucinations.
- **Reliability:** Diagnostic loops (OpenCode) catch bugs before the agent even notices.
