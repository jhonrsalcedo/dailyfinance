# Daily Finance App

Aplicación de finanzas personales para control de gastos diarios con categorías, gráficos y estadísticas.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-005571)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Descripción

Daily Finance es una aplicación web para gestionar tus finanzas personales.-Controla tus ingresos y gastos por categorías
- Visualiza estadísticas y gráficos
- Configura presupuestos por categoría
- Modo oscuro/claro
- Diseño responsive (móvil y PC)

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **MUI v5** (Material UI)
- **React Query** ( estado del servidor)
- **TypeScript**
- **Zod** (validación)
- **Recharts** (gráficos)

### Backend
- **FastAPI** (Python)
- **SQLModel** (ORM)
- **SQLite** (desarrollo) / **PostgreSQL** (producción)
- **JWT** (autenticación)
- **Pytest** (testing)

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- Python 3.12+
- Docker (opcional)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

El backend corre en http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en http://localhost:3000

## 📖 Documentación

- [AGENTS.md](AGENTS.md) - Guía para desarrolladores
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Guía de testing
- [DEPLOY.md](DEPLOY.md) - Guía de despliegue

## 📱 Funcionalidades

| Feature | Descripción |
|---------|------------|
| Dashboard | Resumen de finanzas con gráficos |
| Transacciones | Registro de ingresos/gastos |
| Categorías | Gestión de categorías |
| Presupuesto | Límites por categoría |
| Reports | Estadísticas detalladas |
| Settings | Configuración personal |
| Autenticación | Registro/login con JWT |
| Tema | Modo oscuro/claro |

## 🧪 Testing

```bash
# Frontend
npm run test

# Backend
cd backend && make test
```

## 📂 Estructura

```
dailyfinance/
├── frontend/       # Next.js app
│   ├── app/       # Páginas
│   ├── components/ # Componentes
│   └── utils/     # Utilidades
├── backend/       # FastAPI
│   ├── app/      # Rutas y lógica
│   └── tests/    # Tests
├── docker/        # Docker config
└── db/           # Base de datos
```

## 📄 Licencia

MIT

---

Desarrollado con IA 🔧