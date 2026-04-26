---
description: Run pre-commit checks (lint + tests)
agent: build
---

Run all pre-commit checks locally:
1. npx lint-staged

This executes:
- ESLint
- TypeScript check
- Frontend tests (Vitest)
- Backend tests (Pytest)

Report any failures and suggest fixes.
