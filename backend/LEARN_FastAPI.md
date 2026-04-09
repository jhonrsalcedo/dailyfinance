# LEARN_FastAPI.md
# Patrones y Decisiones de Backend (FastAPI + SQLModel)

## 1. Comandos de Ejecución

```bash
cd backend
make install   # Crear venv + pip install -r requirements.txt
make run       # uvicorn main:app --reload
```

## 2. Conexión a DB

- **SQLite Local:** `Path(__file__).parent.parent.parent / "db" / "dailyfinance.db"`
- **Postgres (Docker):** Variable `DATABASE_URL` en entorno

## 3. Modelos y Schemas

- **SQLModel:** Entidades `Category`, `PaymentMethod`, `Transaction`, `MonthlyBudget`
- **Foreign Keys:** Usar formato `table.column` (ej: `category.id`)
- **Pydantic:** Schemas separados para lectura (`Read`) y escritura (`Create`)

## 4. Endpoints Clave

- `POST /transactions` - Crear transacción
- `GET /transactions?category_id=X&month=YYYY-MM` - Filtrar
- `GET /transactions/stats` - Estadísticas agrupadas por categoría
