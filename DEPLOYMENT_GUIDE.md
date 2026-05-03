# Deployment Guide - Daily Finance App

## Ambientes

| Ambiente | Propósito | Base de Datos |
|----------|----------|---------------|
| **Desarrollo** | Pruebas locales | Turso (libsql) |
| **Producción** | Deploy real | Turso (PostgreSQL) |

---

## Prerequisites

- GitHub account con este repo
- Turso account (DB gratuita)
- Render account (backend)
- Vercel account (frontend)

---

## Desarrollo Local

### 1. Clonar y configurar

```bash
git clone https://github.com/jhonrsalcedo/dailyfinance.git
cd dailyfinance
```

### 2. Configurar backend

```bash
cd backend

# Copiar plantilla
cp .env.example .env

# Editar .env con tus valores
# DATABASE_URL=libsql://dailyfinance-jhonrsalcedo.aws-us-east-2.turso.io
# TURSO_AUTH_TOKEN=tu-token-de-turso
# ENVIRONMENT=development
```

### 3. Instalar y ejecutar

```bash
make install   # Crear venv e instalar dependencias
make run-dev   # Ejecutar en desarrollo
```

### 4. Configurar frontend

```bash
cd frontend
cp .env.local.example .env.local

# Editar con:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 5. Ejecutar frontend

```bash
npm run dev
```

### 6. Acceder

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

---

## Producción (Render + Vercel)

### 1. Deploy Backend a Render

#### Conectar GitHub
1. Ve a https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Conecta tu repo `jhonrsalcedo/dailyfinance`

#### Configurar servicio
| Campo | Valor |
|-------|-------|
| Name | `dailyfinance-api` |
| Branch | `main` |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

#### Environment Variables
| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgres://...turso.io` (PostgreSQL de Turso) |
| `ENVIRONMENT` | `production` |
| `JWT_SECRET` | `python -c "import secrets; print(secrets.token_hex(32))"` |

#### Deploy
Click **Deploy latest commit**

---

### 2. Deploy Frontend a Vercel

#### Conectar GitHub
1. Ve a https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Importa `dailyfinance`
4. Root Directory: `frontend`

#### Environment Variables
| Key | Value |
|-----|-------|
| `NEXTAUTH_SECRET` | Generado: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://dailyfinance-api.onrender.com/api/v1` |

#### Deploy
Click **Deploy**

---

## Verificación

### Test backend

```bash
curl https://dailyfinance-api.onrender.com/health
```

### Test frontend

Abre https://tu-proyecto.vercel.app

---

## Estructura de Archivos

```
dailyfinance/
├── .env                    # NO commiteado (local)
├── .env.example           # Plantilla documentada
├── backend/
│   ├── .env               # NO commiteado
│   ├── .env.example       # Plantilla documentada
│   ├── Makefile           # Scripts de build
│   └── app/config.py      # Config multi-ambiente
└── frontend/
    └── .env.local         # NO commiteado
```

---

## Comandos Útiles

### Backend

```bash
cd backend
make run-dev       # Desarrollo
make run-prod      # Producción
make test         # Tests
```

### Frontend

```bash
cd frontend
npm run dev        # Desarrollo
npm run build     # Build producción
npm run lint      # Linting
```

---

## Troubleshooing

### CORS
Si el frontend no reacha el backend:
- Verificar `NEXT_PUBLIC_API_URL` en Vercel
- Verificar CORS origins en `main.py`

### Database
Si hay errores de DB:
- Verificar `DATABASE_URL` en Render
- Verificar credentials de Turso

### Auth
Si login falla:
- Verificar `JWT_SECRET` en Render
- Verificar `NEXTAUTH_SECRET` en Vercel

---

## URLs Actuales

| Servicio | URL |
|----------|-----|
| Backend | https://dailyfinance.onrender.com |
| Frontend | https://dailyfinance-web.vercel.app |