---
description: Generate 4 content variations in parallel
agent: build
subtask: true
---

You are generating content variations. Spawn 4 parallel subagents, each with a different tone/style:

## Agent 1: Professional & Direct
Task: "Write: $ARGUMENTS. Style: concise, professional, no fluff, action-oriented. Use: short sentences, bullet points, clear CTAs. Audience: B2B decision makers."

## Agent 2: Friendly & Conversational
Task: "Write: $ARGUMENTS. Style: warm, approachable, uses 'you', relatable examples. Use: questions, storytelling, empathy. Audience: end users, consumers."

## Agent 3: Technical & Detailed
Task: "Write: $ARGUMENTS. Style: thorough, precise, evidence-based. Use: data, specifics, how-it-works sections. Audience: engineers, technical users."

## Agent 4: Bold & Provocative
Task: "Write: $ARGUMENTS. Style: attention-grabbing, contrarian angles, strong opinions. Use: hooks, surprising facts, memorable phrases. Audience: social media, thought leadership."

## Consolidation:
After all 4 complete, present:
- Each variation clearly labeled
- Best use case for each
- Recommended pick based on context
- Option to combine elements

Content to generate: $ARGUMENTS
