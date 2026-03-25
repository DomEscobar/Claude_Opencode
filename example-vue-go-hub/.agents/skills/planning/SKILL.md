---
name: planning
description: Expand a short user request into a detailed, scoped product spec before writing any code. Use when a feature request is more than a single-file change, or when the user gives a brief prompt that needs to be fleshed out into concrete requirements.
---

# Skill: Planning

Based on [Anthropic's harness research](../../docs/anthropic-research.md): agents that plan before building produce significantly richer output than those that jump straight to code.

## When to use
- The user gives a brief request that could be interpreted multiple ways
- The feature touches 3+ files or spans frontend and backend
- The task is open-ended ("add user management", "build a dashboard")

## Steps

1. **Read the request carefully.** Identify what the user explicitly asked for and what they likely expect but didn't say.

2. **Expand into a spec.** Write a short planning document covering:
   - **Goal:** One sentence describing what the feature does for the user
   - **Scope:** Bullet list of what's included and what's explicitly excluded
   - **User stories:** 3-5 "As a user, I want to..." statements
   - **Technical approach:** Which packages, directories, and patterns will be used (reference `REGIONAL_MAP.md` and the relevant `AGENTS.md`)
   - **Open questions:** Anything you need the user to clarify before proceeding

3. **Stay high-level on implementation.** Describe *what* will be built, not *how* each function will work. If the plan over-specifies technical details and gets something wrong, those errors cascade into the implementation.

4. **Present the plan to the user.** Wait for confirmation or adjustments before writing code.

## What a good plan looks like

```markdown
## Feature: User Profile Page

**Goal:** Let users view and edit their profile information.

**Scope:**
- View profile (name, email, avatar)
- Edit name and email with validation
- Upload avatar image
- NOT included: password change (separate feature), account deletion

**User stories:**
1. As a user, I can see my current profile info on a dedicated page
2. As a user, I can edit my name and email and see validation errors
3. As a user, I can upload a profile photo

**Technical approach:**
- Backend: new `internal/user/` package with `HandleUserGet` and `HandleUserUpdate` handlers
- Frontend: new `ProfileView.vue` in `src/views/`, new `useUserStore` in `src/stores/`
- Types: add `UserProfile` to `internal/types/schemas.go`, mirror in frontend

**Open questions:**
- What image formats should be accepted for avatar upload?
- Maximum file size for avatar?
```

## Anti-patterns
- Don't start coding before the user confirms the plan
- Don't over-specify implementation details (function signatures, exact SQL)
- Don't pad the spec with features the user didn't ask for without flagging them as suggestions
