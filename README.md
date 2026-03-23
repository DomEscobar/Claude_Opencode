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

## 3. High-Order Enhancements: ast-grep & Symdex
In 2026, we move from **Lexical Search (Text)** to **Structural Search (AST)** and **Symbolic Indexing (Graph)**.

### Level 1: ast-grep (The "X-Ray")
Standard `grep` sees code as lines of text and suffers from "Grep Noise" (matching strings in comments or logs). `ast-grep` sees the **Abstract Syntax Tree**.

- **Precision:** It distinguishes between a *Function Definition*, a *Call Site*, and a *String Literal*.
- **Efficiency:** The agent skips 90% of irrelevant hits, keeping the context window clean.

### Level 2: Symdex (The "Nervous System")
Symdex provides a pre-computed graph of symbol relationships (Definitions, References, Imports).

- **The "Zero-Search Jump":** Instead of searching for a term, the agent asks: *"Where is the definition of the symbol on line 45?"*
- **Teleportation:** The Orient phase drops from 5+ turns to **1 turn**. The agent "teleports" directly to the logic across the codebase.

## The 2026 "Enhanced" Loop Flow
A unified search stack where the agent plans with the graph, searches with the AST, and only falls back to text for prose.

```text
       [ USER PROMPT ]
              │
              ▼
       [ ORIENT (Layered) ]
       ├─ Symdex: "Where is the definition?" (1 Turn)
       ├─ ast-grep: "Find structural matches" (Precision)
       └─ LSP: "Are there type errors now?" (Feedback)
              │
              ▼
       [ DECIDE (One-Turn Resolution) ]
       │  "I have the graph. I have the AST.
       │   I don't need to grep. I will ACT."
              │
              ▼
       [ ACT (Surgical Edit) ]
       │  (Uses AST-paths to replace code blocks
       │   without breaking syntax)
              │
              ▼
       [ VERIFY (AST-Scan) ]
       │  (Runs ast-grep to ensure the 
       │   'N+1 Query' pattern is gone)
              │
              ▼
       [ FINISH ]
```

## Impact: Accuracy vs. Token Cost
- **Lexical (ripgrep):** 8-15 turns | 15k-40k tokens | High Noise.
- **Structural (ast-grep):** 2-4 turns | 5k-12k tokens | Structural Precision.
- **Symbolic (Symdex):** 1-2 turns | 2k-5k tokens | Zero-Waste Navigation.
