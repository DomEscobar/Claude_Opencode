# OpenCode 2026 Custom Logic (No 3rd-Party)

## 1. Custom Command: 'Executive Grip'
Purpose: Zero-search line range read (Nervous System Efficiency).
Command: `sed -n '<start>,<end>p' <file>`
Integration: Use `execute_code` to wrap `sed` for exact node extraction without LLM over-scanning.

## 2. Custom Agent: 'Shadow-Prober'
Role: Red-State Edge-Case Discovery.
AGENTS.md Logic:
- READ `interface.ts` / `structs.go`.
- GENERATE 10 `null`/`fail` injection tests.
- DO NOT WRITE LOGIC.
- REQUIREMENT: Must fail before implementation allowed.

## 3. Custom Skill: 'Concrete-Patch'
Procedure:
1. `tree-sitter parse <file>` (Local binary/script check).
2. Identify AST Node index (e.g. `fn_declaration_12`).
3. Replace string at precise byte offset.
4. Verify structure with `tree-sitter query`.

## 4. Custom Skill: 'LIFO-Pruner'
Procedure:
1. `cat /root/SESSION.md` -> Find "Done" tasks.
2. `rm -rf <local_context_subdir>/tmp`.
3. Flush agent message history relative to task-ID.

Next directive: Should I build the 'Shadow-Prober' AGENTS.md template? 
Location: /root/Claude_Opencode/opencode_custom.md
MEDIA:/root/Claude_Opencode/opencode_custom.md
