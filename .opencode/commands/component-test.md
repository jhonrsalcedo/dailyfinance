---
description: Create new component with test file
agent: build
---

Create a new React component with the given NAME and generate corresponding test file.

Steps:
1. Create component file in frontend/components/
2. Create test file in frontend/components/__tests__/
3. Use Vitest + React Testing Library patterns
4. Run tests to verify component works

Example patterns to follow:
- Test file naming: ComponentName.test.tsx
- Test structure: describe/it/expect
- Use @testing-library/react for rendering
- Mock external dependencies

Run tests after creation to confirm everything works.
