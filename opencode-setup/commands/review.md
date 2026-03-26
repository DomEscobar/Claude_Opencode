---
description: Run tests with coverage
agent: build
---

Run the full test suite with coverage report and show any failures.

!`npm test 2>&1 || echo "No npm test found"`

Focus on the failing tests and suggest fixes. Do not modify any files — report findings only.
