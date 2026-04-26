---
name: dailyfinance-dev
description: Agente especializado para Daily Finance App - Gestión de finanzas personales
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: fullstack
---

# Agente Daily Finance Dev

## Descripción
Agente especializado en el desarrollo y mantenimiento de Daily Finance App, una aplicación de finanzas personales.

## Stack Tecnológico

### Frontend
- Next.js 14 (App Router)
- MUI v5 (@mui/material)
- React Hook Form + Zod
- Recharts
- Vitest (testing)
- TypeScript

### Backend
- FastAPI (Python)
- SQLModel (ORM)
- Pydantic v2
- SQLite (desarrollo)

### DevOps
- Docker + docker-compose
- Husky (pre-commit)
- GitHub Actions (CI/CD)

## Reglas de Código

### Generales
- Sin punto y coma (TypeScript y Python)
- Comillas simples
- Máximo 100-150 líneas por componente/función
- No comentarios en código (documentar en LEARN_*.md)
- Type hints estrictos

### Frontend
- Componentes funcionales con TypeScript
- Usar React Query para estado servidor
- Validación de formularios con Zod

### Backend
- Funciones máximo 50 líneas
- Type hints en todas las funciones
- Usar SQLModel para modelos

## Skills Disponibles

El agente tiene acceso a los siguientes skills:

- `dailyfinance-backend` - Reglas para Backend FastAPI + Python
- `dailyfinance-frontend` - Reglas para Frontend Next.js + MUI
- `dailyfinance-db` - Reglas para Base de Datos SQLite
- `dailyfinance-devops` - Reglas para DevOps Docker + CI/CD
- `dailyfinance-testing` - Reglas para Testing Vitest + Pytest

## Comandos Disponibles

- `/test-all` - Ejecutar todos los tests con coverage
- `/test-watch` - Tests en modo watch para desarrollo
- `/precommit` - Verificar checks antes de commit
- `/component-test` - Crear componente con test

## Estructura del Proyecto

```
app-dailyfinance/
├── frontend/          # Next.js + MUI
├── backend/          # FastAPI + SQLModel
├── db/               # SQLite + schemas
├── docker/           # Dockerfiles
├── .opencode/
│   ├── skills/      # Skills del proyecto
│   ├── commands/    # Comandos personalizados
│   └── agents/      # Agentes
```

## API Base URL
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/categories` | Listar categorías |
| POST | `/api/v1/categories` | Crear categoría |
| GET | `/api/v1/transactions` | Listar transacciones |
| POST | `/api/v1/transactions` | Crear transacción |
| GET | `/api/v1/transactions/stats` | Estadísticas |
| GET/POST | `/api/v1/settings` | Configuración usuario |

## Flujo de Trabajo

1. **Desarrollo**: Crear feature en branch separada
2. **Testing**: Ejecutar tests antes de commit (`npm run test` + `pytest`)
3. **Pre-commit**: Husky corre lint + typecheck + tests
4. **CI/CD**: GitHub Actions corre en cada push

## Documentación Adicional

- LEARN_FastAPI.md - Patrones Backend
- LEARN_NextJS.md - Patrones Frontend
- LEARN_SQL.md - Diseño de DB
- LEARN_Docker.md - Comandos Docker
- DEVELOPMENT_GUIDE.md - Guía de desarrollo
