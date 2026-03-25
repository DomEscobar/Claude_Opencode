---
name: context-handoff
description: Create a structured handoff artifact when work needs to continue in a new session. Use when a task spans multiple sessions, when context is getting large, or when handing off work to another agent or human.
---

# Skill: Context Handoff

Based on [Anthropic's harness research](../../docs/anthropic-research.md): full context resets with structured handoff artifacts outperform compaction (summarizing conversation in place). A clean slate eliminates "context anxiety" where agents rush to finish as the window fills.

## When to use
- The task is large and will span multiple chat sessions
- You sense the context window is getting crowded (responses becoming less focused)
- You're handing off work to a different agent or human
- The user explicitly asks you to pause and resume later

## The handoff artifact

Write a file called `HANDOFF.md` in the project root. It must contain enough state for a fresh agent to continue the work without reading the previous conversation.

### Required sections

```markdown
# Handoff: [Feature Name]

## Status
[One line: what phase this is in -- planning, implementing, testing, blocked]

## What was completed
- [Bullet list of concrete deliverables with file paths]
- [Include test results: X tests passing, Y failing]

## What's next
1. [Ordered list of remaining tasks]
2. [Be specific: "implement HandleUserUpdate in internal/user/handler.go"]
3. [Not vague: "finish the user feature"]

## Current state
- Branch: [branch name]
- Last passing test run: [command and result]
- Known issues: [list any bugs or edge cases discovered but not yet fixed]

## Key decisions made
- [Architectural choices that a new agent needs to know]
- [e.g. "Chose cursor-based pagination over offset because..."]
- [e.g. "UserProfile is a separate type from User to avoid exposing password hash"]

## Blockers (if any)
- [What specifically is preventing progress]
- [What information or action is needed to unblock]
```

## Steps

1. **Assess the state.** What's done, what's not, what's broken.
2. **Run tests.** Record the current pass/fail status.
3. **Write the handoff.** Fill in every section of the template above. Be concrete.
4. **Commit the handoff.** `git add HANDOFF.md && git commit -m "docs: add handoff artifact for [feature]"`
5. **Tell the user** the handoff is ready and what to say when resuming ("Continue the work described in HANDOFF.md").

## When resuming from a handoff
1. Read `HANDOFF.md` first.
2. Read the files listed in "What was completed" to understand current state.
3. Run the test command from "Current state" to verify the baseline.
4. Continue from "What's next" item 1.
5. Delete `HANDOFF.md` when the work is fully complete.

## Anti-patterns
- Don't write vague handoffs ("mostly done, just needs finishing")
- Don't skip the test results -- the resuming agent needs a verified baseline
- Don't rely on conversation history -- the next session starts clean
