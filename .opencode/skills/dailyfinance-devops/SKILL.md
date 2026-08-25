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

## Deployment a Producción

### Flujo Estándar
1. Trabajar en `develop`
2. Verificar (`npm run check` + tests)
3. Push a `develop`
4. Acumular cambios hasta tener un conjunto coherente (release por lotes)
5. **PREGUNTAR**: "¿Listo para hacer release vX.Y.Z?"
6. Si usuario confirma → bump versión + CHANGELOG + merge + tag + push

### Regla: Releases por Lotes
> `main` NO se sincroniza después de cada push a develop. Los releases son por lotes: cuando hay features/fixes acumulados que forman una versión coherente. SIEMPRE preguntar antes de pushear a main.

### Pasos Post-Confirmación
```bash
# 1. Preparar versión (en develop)
#    - frontend/config/version.ts: APP_VERSION = 'vX.Y.Z'
#    - CHANGELOG.md: mover [Sin liberar] a [vX.Y.Z] - fecha
#    - Commit: "release: vX.Y.Z"

# 2. Merge a producción
git checkout main
git pull origin main
git merge develop

# 3. Tag y push
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin main --tags

# 4. Volver a develop
git checkout develop
```

### Checklist Pre-Production
- [ ] Frontend checks pasan (lint + typecheck + test)
- [ ] Backend checks pasan (pytest)
- [ ] APP_VERSION actualizado en frontend/config/version.ts
- [ ] CHANGELOG.md actualizado ([Sin liberar] → [vX.Y.Z])
- [ ] Usuario confirmó → proceder
