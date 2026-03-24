# Agentic Taxonomy: Skills vs. MCP vs. Plugins

In the **2026 Agentic Architecture**, the distinction between these three components defines where the "intelligence" sits and how the agent interacts with the world.

---

## 1. The Taxonomy Breakdown

| Component | Biological Role | Technical Definition | Primary "Owner" |
| :--- | :--- | :--- | :--- |
| **MCP** | **Sensory Organ** | A standardized *protocol* (JSON-RPC) for an agent to read/write to external APIs or databases (GitHub, Postgres, Slack, Sentry). | **The Protocol** (Standardized) |
| **Plugin** | **Prosthetic** | Hard-coded runtime extensions (often compiled Go/Rust) that add new core capabilities to the agent's binary (e.g., a specific terminal backend or a browser-automation engine). | **The Runtime** (Core Engine) |
| **Skill** | **Muscle Memory** | A natural-language *procedure* (Markdown + Scripts) that defines a recurring sequence of tool calls to solve a specific problem class. | **The Agent** (Persona/Memory) |

### The Relationship in Action:
*   **MCP** provides the **Eyes**: "I can see the GitHub issues."
*   **Plugin** provides the **Hands**: "I can execute a safe Bash command in a Docker container."
*   **Skill** provides the **Brain's Routine**: "When I see a bug report (MCP Eye), I run these 5 Bash commands (Plugin Hand) to fix it."

---

## 2. Why CLIs are Superior to MCPs (The 2026 Reality)

While MCP is the future of **Sensory Input**, the **CLI (Command Line Interface)** remains the superior **Execution Plane** for agentic work.

### A. Data-Filtering at the Source (O(1) Context)
*   **MCP:** If an agent needs to find a string in 100 files via MCP, it must perform 100 structured handshakes, often returning massive JSON objects that bloat the context window.
*   **CLI:** The agent runs `rg "pattern" | head -n 5`. The filtering happens in the **runtime kernel**. The agent only receives the 5 relevant lines, saving 99% in token costs.

### B. Local Logic Gates (Zero-Latency Decisioning)
CLIs allow for **deterministic verification** without an LLM "thinking" turn.
*   **Example:** `npm test || (git checkout . && exit 1)`
*   This command self-heals or rolls back based on exit codes instantly. In an MCP-only world, the agent would have to call the Test MCP, read the result, reason about the failure, and then call the Rollback MCP. The CLI does this in 10ms with zero extra cost.

### C. Tool-Chain Composition (The "Pipe" Power)
MCPs are often siloed. A Google Maps MCP cannot naturally "pipe" its data into a custom SQLite MCP without the agent acting as a middleman. 
In a **CLI**, the agent can use the Unix philosophy: `curl [MCP_URL] | jq | sqlite3`. Everything is a stream, and anything can be piped to anything.

---

## Summary for Outreach
> **"MCP is for Data (Sensing), but the CLI is for Power (Action)."**

Build your "Eyes" with MCP, but keep your "Hands" on the CLI. Today's Restricted MCPs are a bottleneck; the Unrestricted CLI is where the real "Senior Engineer" agency lives.

---
*Created by [Hermes Agent](https://hermes-agent.nousresearch.com) for Dom (@DomEscobar)*
