---
name: dailyfinance-devops
description: Reglas para DevOps Docker + CI/CD + Local Checks
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: devops
---

# Reglas para DevOps (Docker + CI/CD + Local Checks)

## Imágenes
- Backend: python:3.11-slim
- Frontend: node:20-alpine

## docker-compose.yml
- Servicio backend (FastAPI)
- Servicio frontend (Next.js)
- SQLite para desarrollo local

## Comandos
```bash
# Desarrollo
make install  # Backend
make run     # Backend

cd frontend && npm install
npm run dev  # Frontend

# Docker
docker-compose up --build

# Checks locales (pre-commit)
npx lint-staged

# Verificar que husky funciona
npx husky run pre-commit
```

## Optimización M3 (8GB RAM)
- Usar imágenes slim/alpine
- No exceeding memory limits

## CI/CD Pipeline
Ver archivo: `.github/workflows/checks.yml`

### Jobs:
1. **lint-and-typecheck**: ESLint + TypeScript
2. **build**: Next.js build (depende de anterior)
3. **backend-checks**: Verificación de backend

### Para agregar en GitHub:
1. Subir código a GitHub
2. Ir a Actions tab → Los workflows aparecen automáticamente
3. Cada push a main/PR ejecuta los checks

## Pre-commit Hooks
Archivos:
- `.husky/pre-commit` - Hook que ejecuta lint-staged
- `lint-staged.config.js` - Config de archivos a verificar

### Para nuevo developer:
```bash
npm install
npx husky install  # Opcional, prepare script lo hace automático
```

## Documentación
- LEARN_Docker.md - Comandos Docker
- LEARN_CICD.md - Guía de GitHub Actions y CI/CD
- DEVELOPMENT_GUIDE.md - Sección 7: Git Workflow con Checks
