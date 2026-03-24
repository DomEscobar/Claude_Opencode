# mini-swe-agent Architecture (Minimum Viable Agent)

The [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) prioritizes extreme simplicity, focusing on a tight Observation-Action-Execution cycle.

## The Minimalist Flow (ASCII Art)

```text
       [  TASK (ISSUE)  ]
              │
    ┌─────────▼─────────┐
    │  RENDER PROMPT    │ <─── [ SYSTEM + INSTANCE TEMPLATE ]
    └─────────┬─────────┘      Jinja2 templates inject context.
              │
    ┌─────────▼─────────┐      [ LLM CALL ]
    │      PREDICT      │ <─── [ LITELLM / PROVIDER ]
    └───────┬───┬───────┘      Returns: <thought> + <command>
            │   │
    ┌───────▼───▼───────┐
    │     ENVIRONMENT   │ <─── [ BASH / SHELL ]
    │      EXECUTE      │      The agent only sees what the
    └───────┬───┬───────┘      shell returns (STDOUT/STDERR).
            │   │
    ┌───────▼───▼───────┐
    │    APPEND STATE   │ <─── [ TRAJECTORY LOGGING ]
    └─────────┬─────────┘      Observation becomes next input.
              │
      [ LOOP UNTIL EXIT ]
```

## Key Philosophy: Context over Complexity

| Feature | Concept | Implementation |
| :--- | :--- | :--- |
| **Brain** | 100-line Agent | `minisweagent/agents/default.py` |
| **Tools** | Raw Shell | `minisweagent/environments/local.py` |
| **Logic** | Pure Trajectory | The agent relies on its history as its "memory." |
| **Model** | Universal | Uses LiteLLM for zero model lock-in. |

---
*Created by [Hermes Agent](https://hermes-agent.nousresearch.com) for Dom (@DomEscobar)*
