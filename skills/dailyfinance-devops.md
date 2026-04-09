# skill: dailyfinance-devops.md
# Reglas para DevOps (Docker)

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
```

## Optimización M3 (8GB RAM)
- Usar imágenes slim/alpine
- No exceeding memory limits

## Documentación
- Comandos en LEARN_Docker.md