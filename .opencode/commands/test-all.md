---
description: Run all tests (frontend + backend) with coverage
agent: build
---

Run full test suite for both frontend and backend:
1. Frontend: cd frontend && npm run test:coverage
2. Backend: cd backend && make test-cov

Show summary of:
- Test results (passed/failed)
- Coverage percentages
- Any failing tests that need attention

Suggest fixes for any failing tests.
