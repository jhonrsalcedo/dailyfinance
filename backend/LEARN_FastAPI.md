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

## 5. Aislamiento Multi-Usuario (user_id) — Agosto 2026

### Problema detectado en auditoría DevTools

Las tablas `transaction` y `monthlybudget` NO tenían columna `user_id`.
Cualquier usuario autenticado veía y modificaba transacciones de otros.

### Solución implementada

1. **Migración idempotente** en `backend/app/database.py`:
   - Función `run_migrations(engine)` llamada desde lifespan de `main.py`
   - `ALTER TABLE ADD COLUMN user_id INTEGER REFERENCES "user"(id)` + índice
   - ⚠️ `transaction` es palabra reservada en SQLite → SIEMPRE escapar con comillas dobles
2. **Filtrado por usuario** en todos los routers:
   - `transactions.py`, `budget.py`, `stats.py`: dependencia `get_current_user`
   - Queries filtran por `Transaction.user_id == current_user.id`
   - Checks de propiedad → HTTP 403 si el recurso es de otro usuario
3. **Filas legacy** (`user_id=NULL`): quedan invisibles para todos (decisión de diseño)

### Verificación end-to-end

- Usuario A crea tx → A la ve; Usuario B ve 0 transacciones
- B intenta DELETE de la tx de A → 403
- Stats/export CSV aislados por usuario
- Tests: `test_transactions_isolated_per_user`, `test_get_transactions_requires_auth`

### Lección clave

Los endpoints GET también deben requerir auth cuando exponen datos de usuario.
El "modo demo" del frontend usa datos estáticos, no necesita API real.
