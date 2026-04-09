# Daily Finance App

Aplicación de finanzas personales para control de gastos diarios con categorías, gráficos y estadísticas.

## Stack Tecnológico

- **Frontend:** Next.js 15 + MUI v5 + React Hook Form + Zod + Recharts
- **Backend:** FastAPI + SQLModel + Pydantic
- **Base de Datos:** SQLite (desarrollo) / PostgreSQL (producción)
- **Moneda:** Pesos Colombianos (COP)

## Requisitos Previos

- Python 3.11+
- Node.js 18+
- npm

## Instalación y Ejecución

### Backend (FastAPI)

```bash
cd backend
make install   # Solo la primera vez
make run       # Inicia en http://localhost:8000
```

### Frontend (Next.js)

```bash
cd frontend
make install   # Solo la primera vez
make dev       # Inicia en http://localhost:3000
```

## Estructura del Proyecto

```
app-dailyfinance/
├── backend/              # FastAPI + SQLModel
│   ├── app/
│   │   ├── routes/       # Endpoints API
│   │   ├── database.py   # Modelos SQLModel
│   │   └── schemas.py    # Schemas Pydantic
│   └── main.py
├── frontend/             # Next.js + MUI
│   ├── app/             # Pages y layout
│   ├── components/      # Componentes React
│   ├── schemas/         # Schemas Zod
│   ├── theme/           # Tema MUI
│   └── utils/           # Utilidades (currency)
├── db/                  # SQLite + schema + seed
│   └── dailyfinance.db  # Base de datos
└── docker/              # Dockerfiles
```

## Categorías Predefinidas

1. Ingresos
2. Vivienda
3. Transporte
4. Alimentación
5. Entretenimiento
6. Salud
7. Vehículo
8. Familia
9. Deudas/Crédito
10. Misceláneos

## Métodos de Pago

1. Efectivo
2. Tarjeta Débito
3. Tarjeta Crédito

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/categories` | Listar categorías |
| POST | `/api/v1/categories` | Crear categoría |
| GET | `/api/v1/transactions` | Listar transacciones |
| POST | `/api/v1/transactions` | Crear transacción |
| GET | `/api/v1/transactions/stats` | Estadísticas mensuales |

## Formato de Moneda

Los montos se muestran en Pesos Colombianos (COP):
- `$50.000`
- `$1.500.000`
- `$7.878.800`

## Docker (Opcional)

```bash
docker-compose up --build
```

## Documentación de Aprendizaje

- `db/LEARN_SQL.md` - Conceptos de SQL y diseño de DB
- `backend/LEARN_FastAPI.md` - Patrones de FastAPI
- `frontend/LEARN_NextJS.md` - Patrones de Next.js
- `docker/LEARN_Docker.md` - Comandos y optimización Docker
