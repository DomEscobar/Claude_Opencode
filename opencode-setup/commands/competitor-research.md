---
description: Competitive research with 4 parallel analysts
agent: build
subtask: true
---

You are running competitive research. Spawn 4 parallel subagents:

## Agent 1: Pricing Analyst
Task: "Research pricing for: $ARGUMENTS. Find: pricing tiers, free tier limits, enterprise pricing, billing model (usage/seat/flat). Report: pricing table, value metric, positioning."

## Agent 2: Feature Analyst
Task: "Research features for: $ARGUMENTS. Find: core features, differentiators, missing features, recent additions. Report: feature comparison, gaps, unique selling points."

## Agent 3: Positioning Analyst
Task: "Research positioning for: $ARGUMENTS. Find: target audience, messaging, value props, brand voice. Report: positioning statement, target personas, key messages."

## Agent 4: Review Analyst
Task: "Research reviews for: $ARGUMENTS. Find: G2/Capterra reviews, Twitter sentiment, Reddit discussions, common complaints, praise points. Report: sentiment score, top complaints, top praise."

## Consolidation:
After all 4 complete, produce:
- Competitive landscape summary
- Your product's relative position
- Gaps you could fill
- Differentiation opportunities
- Recommended actions

Target to research: $ARGUMENTS
