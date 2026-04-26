---
name: dailyfinance-testing
description: Reglas para testing frontend y backend con Vitest y Pytest
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: testing
---

# Reglas para Testing (Vitest + Pytest)

## Obligatoriedad
**TODO feature nueva → Escribir tests antes de commit**

## Stack de Testing

### Frontend
- **Vitest** (test runner)
- **React Testing Library** (componentes)
- **msw** (mock de APIs)

### Backend
- **Pytest** (test runner)
- **httpx** (client for testing)

## Reglas de Código
- Sin punto y coma
- Máximo 100 líneas por test
- Descriptivos: `test("should return transaction by id")`
- AAA Pattern: Arrange → Act → Assert

## Estructura de Archivos

### Frontend
```
frontend/
├── components/
│   └── __tests__/
│       └── TransactionForm.test.tsx
├── services/
│   └── __tests__/
│       └── api.test.ts
└── vitest.config.ts
```

### Backend
```
backend/
├── app/
│   └── routes/
│       └── test_transactions.py
└── tests/
    └── test_api.py
```

## Scripts de Test

### Frontend
```bash
npm run test          # Ejecutar tests
npm run test:watch    # Modo watch
npm run test:coverage # Coverage report
```

### Backend
```bash
pytest                # Ejecutar todos
pytest -v             # Verbose
pytest --cov=app      # Coverage
```

## Cobertura Mínima
- **80%** coverage objetivo
- 100% coverage en funciones críticas (auth, cálculos, DB)

## Integración con Git

### Pre-commit (local)
```bash
npx vitest run
pytest
```
Si falla → No permite commit

### CI/CD (GitHub Actions)
Job adicional después de lint:
```yaml
test:
  needs: lint-and-typecheck
  run: npm run test && pytest
```

## Patrones de Test

### Test de Componente React
```tsx
import { render, screen, fireEvent } from '@testing-library/react'

test('should render transaction form', () => {
  render(<TransactionForm />)
  expect(screen.getByLabelText('Monto')).toBeInTheDocument()
})
```

### Test de API FastAPI
```python
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_create_transaction():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/transactions", json={...})
    assert response.status_code == 201
```

## Checklist Pre-commit
- [ ] Tests pasan localmente
- [ ] Coverage ≥ 80%
- [ ] No hay console.log de debug
- [ ] Tests son descriptivos

## Documentación
- LEARN_Testing.md - Guía completa de testing
- vitest.config.ts - Configuración
- pytest.ini - Configuración
