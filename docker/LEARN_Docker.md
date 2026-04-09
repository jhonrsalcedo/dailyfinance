# LEARN_Docker.md
# Conceptos y Optimización de Contenedores (M3 8GB)

## 1. Estrategia de Imagen
- **Backend:** Usamos `python:3.11-slim`. Esto es mejor que la versión completa, ya que no incluye herramientas de desarrollo innecesarias.
- **Frontend:** Usamos `node:20-alpine` para el build, lo cual es la imagen más ligera disponible para Node.

## 2. Docker Compose
- Se define un servicio `db` (PostgreSQL 15 Alpine) y servicios `frontend` y `backend`.
- **Dependencias:** El backend depende del `db` (`depends_on: db`).
- **SQLite vs Postgres:** Inicialmente, el backend apunta a la URL de Postgres, pero **no se ejecuta `create_db_and_tables` en el servicio de FastAPI**. Esto se debe corregir manualmente en `database.py` para que use el archivo local `db/dailyfinance.db` mientras estemos en desarrollo local con SQLite.

## 3. Comandos Útiles
- **Iniciar:** `docker-compose up -d --build`
- **Ver logs:** `docker-compose logs -f backend`
- **Ejecutar SQL (futuro):** `docker exec -it dailyfinance_backend python -c "import sqlite3..."` (cuando la DB sea SQLite en el contenedor).

## 4. Optimización M3
Al usar imágenes `slim` o `alpine`, reducimos la superficie de ataque y el consumo de RAM y CPU en comparación con imágenes estándar.
