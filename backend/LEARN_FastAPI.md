# LEARN_FastAPI.md
# Patrones y Decisiones de Backend (FastAPI + SQLModel)

## 1. Comandos de Ejecución

```bash
cd backend
make install   # Crear venv + pip install -r requirements.txt
make run       # uvicorn main:app --reload
```

## 2. Conexión a DB

La configuración de base de datos está en `app/config.py`:

### Variables de Entorno

| Variable | Desarrollo | Producción |
|----------|-----------|-------------|
| `DATABASE_URL` | (vacío → SQLite) | `libsql://...` (Turso) |
| `TURSO_AUTH_TOKEN` | N/A | Token de Turso |
| `ENVIRONMENT` | development | production |

### Lógica de Conexión

```python
def get_database_url() -> str:
    return os.getenv("DATABASE_URL", "")  # Si vacío → SQLite local

# development → db/dailyfinance.db (SQLite)
# production → Turso libSQL
```

### Seguridad

- ✅ `.env` y `.env.local` están en `.gitignore`
- ✅ Nunca commitear archivos con secrets
- ✅ Usar `.env.example` como plantilla

## 3. Modelos y Schemas

- **SQLModel:** Entidades `Category`, `PaymentMethod`, `Transaction`, `MonthlyBudget`
- **Foreign Keys:** Usar formato `table.column` (ej: `category.id`)
- **Pydantic:** Schemas separados para lectura (`Read`) y escritura (`Create`)

## 4. Endpoints Clave

- `POST /transactions` - Crear transacción
- `GET /transactions?category_id=X&month=YYYY-MM` - Filtrar
- `GET /transactions/stats` - Estadísticas agrupadas por categoría
