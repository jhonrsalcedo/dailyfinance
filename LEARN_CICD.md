# LEARN: CI/CD y Git Hooks

## Resumen
Este proyecto usa dos niveles de verificación de código:
1. **Git Hooks locales (Husky)** - Verifica antes de cada commit
2. **GitHub Actions (CI/CD)** - Verifica con cada push

## Git Hooks (Local)

### Qué es Husky
Husky permite ejecutar scripts antes de operaciones git (commit, push, etc.)

### Qué es lint-staged
Ejecuta linters/formatters SOLO en archivos que están en staging (listos para commit)

### Por qué juntos
- Husky activa el hook
- lint-staged sabe qué archivos verificar
- Solo se verifican archivos modificados (rápido)

### Configuración Actual

**.husky/pre-commit:**
```bash
npx lint-staged
```

**lint-staged.config.js:**
```javascript
module.exports = {
  'frontend/**/*.{ts,tsx}': [
    () => 'cd frontend && npm run lint',
    () => 'cd frontend && npm run typecheck'
  ],
  'frontend/**/*.json': [],
  '*.md': []
}
```

### Flujo de Ejecución
```
git add frontend/app/page.tsx
git commit -m "fix: algo"
         ↓
┌─────────────────────────────────┐
│  Husky hook (pre-commit)       │
│  Ejecuta: npx lint-staged      │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  lint-staged                   │
│  Busca archivos .ts/.tsx       │
│  en staging                    │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  npm run lint                  │
│  (ESLint - código style)      │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  npm run typecheck             │
│  (TypeScript - tipos)          │
└─────────────────────────────────┘
         ↓
Si todo pasa → Commit creado ✓
Si falla → Error mostrado, commit bloqueado
```

### Comandos Útiles
```bash
# Ver qué haría lint-staged sin ejecutar
npx lint-staged --dry-run

# Ejecutar hook manualmente
npx husky run pre-commit

# Ver logs de hooks
cat .husky/pre-commit
```

## GitHub Actions (Cloud CI/CD)

### Qué es GitHub Actions
Sistema de CI/CD integrado en GitHub que ejecuta workflows con cada push/PR.

### Workflow Actual: `.github/workflows/checks.yml`

```yaml
name: Code Quality Checks

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Jobs

#### 1. lint-and-typecheck
```yaml
- name: Run ESLint
  run: npm run lint
  working-directory: ./frontend

- name: Run TypeScript check
  run: npm run typecheck
  working-directory: ./frontend
```

#### 2. build (depende de lint-and-typecheck)
```yaml
needs: lint-and-typecheck

- name: Build application
  run: npm run build
  working-directory: ./frontend
```

#### 3. backend-checks
```yaml
- name: Install dependencies
  run: pip install -r requirements.txt
  working-directory: ./backend
```

### Ver Results
1. Ve al repo en GitHub
2. Click en "Actions" tab
3. Verás los workflows ejecutándose

### Status Badges (para agregar al README)
```markdown
[![CI](https://github.com/USERNAME/REPO/actions/workflows/checks.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/checks.yml)
```

## Agregar Más Checks

### Para Frontend
```yaml
- name: Run tests
  run: npm test
  working-directory: ./frontend

- name: Run Playwright tests
  run: npx playwright test
  working-directory: ./frontend
```

### Para Backend
```yaml
- name: Run pytest
  run: pytest tests/
  working-directory: ./backend

- name: Run mypy
  run: mypy app/
  working-directory: ./backend
```

## Troubleshooting

### Hook no se ejecuta
```bash
# Verificar que husky está instalado
cat .husky/pre-commit

# Reinstalar hooks
npx husky install
```

### lint-staged no encuentra archivos
```bash
# Ver qué archivos están staged
git status

# Ver patrón de archivos
cat lint-staged.config.js
```

### GitHub Actions falla
1. Click en el workflow fallido
2. Revisa los logs del step que falló
3. Los errores más comunes:
   - Dependencias no instaladas
   - Variables de entorno faltantes
   - Errores de código (debería pasar local primero)

## Recursos
- [Husky Docs](https://typicode.github.io/husky/)
- [lint-staged Docs](https://github.com/lint-staged/lint-staged)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
