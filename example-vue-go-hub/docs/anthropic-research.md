# Anthropic Research: Harness Design for Long-Running Apps

Source: [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) (March 24, 2026)

## Why This Matters

Naive single-agent implementations hit two ceilings on complex tasks:
1. **Context degradation** -- Agents lose coherence as the context window fills. Some models exhibit "context anxiety," wrapping up prematurely.
2. **Self-evaluation failure** -- Agents consistently praise their own work, even when quality is mediocre. This is especially bad for subjective tasks but also occurs on verifiable ones.

## Key Patterns

### 1. Planner-Generator-Evaluator Architecture

Decompose work into three specialized roles:

| Role | Responsibility | Key behavior |
| :--- | :--- | :--- |
| **Planner** | Expand a short prompt into a detailed spec | Stay high-level on implementation. Avoid specifying technical details that could cascade errors. |
| **Generator** | Build features one at a time against the spec | Self-test at the end of each sprint, but hand off to the evaluator for real verification. |
| **Evaluator** | Test the running application and grade against criteria | Be skeptical by default. Navigate the app via Playwright, don't just read code. |

**Example from the article:** A one-line prompt ("Create a 2D retro game maker") was expanded by the planner into a 16-feature spec across 10 sprints, including AI-assisted sprite generation and game export -- features the user hadn't explicitly asked for but that made the product richer.

### 2. Sprint Contracts

Before each chunk of work, the generator and evaluator negotiate what "done" looks like in testable terms.

**Why it works:** The product spec is intentionally high-level. Sprint contracts bridge the gap between user stories and testable implementation without over-specifying too early.

**Example from the article:** Sprint 3 alone had 27 testable criteria for the level editor. The evaluator graded each one and filed specific bugs:

> "Rectangle fill tool only places tiles at drag start/end points instead of filling the region. fillRectangle function exists but isn't triggered properly on mouseUp."

### 3. Separated Evaluation

The evaluator must be a different agent (or at minimum, a separate invocation with a skeptical prompt) from the generator.

**Why separation matters:**
- Generators talk themselves into approving their own work
- Tuning a standalone evaluator to be skeptical is far more tractable than making a generator self-critical
- The evaluator provides concrete feedback the generator can iterate against

**How to tune the evaluator:** Read the evaluator's logs, find examples where its judgment diverged from yours, and update the prompt to solve for those cases. Takes several rounds before grading is reasonable.

### 4. Grading Criteria (Making Subjective Quality Gradable)

Convert vague questions ("is this good?") into concrete, weighted criteria:

| Criterion | Weight | What it measures |
| :--- | :--- | :--- |
| **Design quality** | High | Does it feel like a coherent whole, not a collection of parts? |
| **Originality** | High | Evidence of deliberate creative choices vs. template defaults? |
| **Craft** | Normal | Technical execution: spacing, typography, contrast, hierarchy |
| **Functionality** | Normal | Can users understand and complete tasks without guessing? |

Weight design and originality higher because models already score well on craft and functionality by default. Explicitly penalize generic "AI slop" patterns.

### 5. Context Resets Over Compaction

Full context resets (clear the window, start fresh with a structured handoff artifact) outperform compaction (summarizing earlier conversation in place).

**Why:** Compaction preserves continuity but doesn't eliminate context anxiety. A reset gives a clean slate. The cost is that the handoff artifact must carry enough state for the next agent to pick up cleanly.

**Handoff artifact should contain:**
- Current state of the build
- What's been completed and verified
- What's next in the plan
- Any known issues or blockers

### 6. Simplify As Models Improve

> "Every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing."

When a new model lands, re-examine the harness:
- Strip away pieces no longer load-bearing
- Add new pieces to achieve capabilities that weren't possible before
- The interesting harness space doesn't shrink -- it moves

**Example from the article:** Moving from Opus 4.5 to 4.6, they dropped the sprint decomposition entirely because 4.6 could sustain coherence for 2+ hours without it. The evaluator remained valuable but only for tasks at the model's capability edge.

## Results Comparison

| Approach | Duration | Cost | Outcome |
| :--- | :--- | :--- | :--- |
| Solo agent (no harness) | 20 min | $9 | Core feature (game play) was broken |
| Full harness (Opus 4.5) | 6 hr | $200 | Working app with polish, all core features functional |
| Simplified harness (Opus 4.6) | 4 hr | $125 | Comparable quality, 40% cheaper, sprint construct removed |

## Principles for This Template

Based on this research, these patterns are integrated into the project workflow:

1. **Plan before building** -- For non-trivial features, expand the requirement into a scoped spec before writing code. (See `.agents/skills/planning/SKILL.md`)
2. **Define done before starting** -- Negotiate testable completion criteria before implementing. (See `.agents/skills/sprint-contract/SKILL.md`)
3. **Separate evaluation from generation** -- The agent that reviews should be skeptical, test the running app, and grade against concrete criteria. (See `.agents/skills/code-review/SKILL.md`)
4. **Use structured handoffs** -- When work spans sessions, write a handoff artifact, don't rely on conversation history. (See `.agents/skills/context-handoff/SKILL.md`)
5. **Periodically simplify** -- Re-examine whether each rule and skill is still load-bearing. Remove what the current model handles natively.
