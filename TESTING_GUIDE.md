# Testing Guide

## Overview

This project uses a multi-layered testing strategy:
- **Unit Tests**: Individual components and functions
- **Integration Tests**: API endpoints
- **E2E Tests**: Full browser flows

---

## Backend Testing (Pytest)

### Structure
```
backend/
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # API integration tests
│   └── conftest.py     # Shared fixtures
```

### Run Tests
```bash
cd backend
make test           # Run all tests
make test-cov       # Run with coverage
pytest -v           # Verbose output
pytest --watch     # Watch mode
```

### Example Test
```python
import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_create_transaction():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/transactions/", json={
            "amount": 50000,
            "category_id": 3,
            "method_id": 1,
            "date": "2026-04-24"
        })
    assert response.status_code == 200
```

### Dependencies
```bash
pip install pytest pytest-asyncio httpx
```

---

## Frontend Testing (Vitest)

### Structure
```
frontend/
├── components/
│   └── __tests__/      # Component unit tests
├── app/
│   └── __tests__/      # Page tests
├── utils/
│   └── __tests__/      # Function tests
```

### Run Tests
```bash
cd frontend
npm run test           # Run all tests
npm run test:ui        # Interactive UI
npm run test:cov       # With coverage
```

### Example Test
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TransactionForm from '../TransactionForm'

describe('TransactionForm', () => {
  it('renders amount field', () => {
    render(<TransactionForm />)
    expect(screen.getByLabelText(/monto/i)).toBeDefined()
  })
})
```

---

## E2E Testing (Playwright)

### Setup
```bash
cd frontend
npx playwright install chromium
```

### Structure
```
frontend/
├── e2e/
│   ├── auth.spec.ts
│   ├── transactions.spec.ts
│   └── dashboard.spec.ts
```

### Run Tests
```bash
npm run test:e2e           # Run all E2E
npx playwright test --ui  # Interactive mode
```

### Example Test
```typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
})
```

---

## Testing Best Practices

### AAA Pattern
```python
# Arrange - Setup
user = create_user()

# Act - Execute
result = user.login()

# Assert - Verify
assert result.success is True
```

### Test Naming
- Use descriptive names: `test_user_can_login`
- Describe what it tests: `test_transaction_form_validates_amount`
- Include expected behavior: `test_create_transaction_increases_total`

### Coverage Goals
- Minimum: 70% coverage
- Target: 80% coverage
- Critical paths: 100%

---

## CI/CD Testing

GitHub Actions runs on every push:
1. `lint` - ESLint
2. `typecheck` - TypeScript
3. `build` - Next.js build
4. `test` - Unit tests
5. `test:e2e` - E2E tests (optional, slower)

---

## Debugging Failed Tests

### Backend
```bash
pytest -v --tb=short        # Short traceback
pytest --capture=no         # Show print statements
pytest -k "test_name"       # Run specific test
```

### Frontend
```bash
npm run test -- --reporter=verbose
npm run test -- --update    # Update snapshots
```

### E2E
```bash
npx playwright test --trace on
npx playwright show-report
```