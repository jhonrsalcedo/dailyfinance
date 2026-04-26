# Deployment Guide - Paso a Paso

## Requisitos Previos

1. Cuenta en [GitHub](https://github.com)
2. Cuenta en [Vercel](https://vercel.com) (gratis)
3. Cuenta en [Railway](https://railway.app) (~$5/mes)

---

## Paso 1: Subir a GitHub

### 1.1 Crear repo en GitHub
1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `dailyfinance-app`
3. Visibilidad: Private (o Public)
4. No inicializar - lo haremos desde local
5. Click "Create repository"

### 1.2 Conectar y subir
```bash
cd /Users/jhonsalcedo/projects/ia-projects/ia-opencode/app-dailyfinance

# Inicializar git (si no está)
git init
git add .
git commit -m "feat: all modules with API + deploy ready"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/dailyfinance-app.git
git branch -M main
git push -u origin main
```

---

## Paso 2: Deploy Backend en Railway

### 2.1 Configurar proyecto
1. Ve a [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Autoriza GitHub
4. Selecciona `dailyfinance-app`
5. Railway detectará automaticamente

### 2.2 Configuración del servicio
**Para backend:**
1. Click en el servicio "backend"
2. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: (vacío o `pip install -r requirements.txt`)
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`

### 2.3 Variables de Entorno
1. Variables → Add Variable:
   ```
   DATABASE_URL=sqlite:///db/dailyfinance.db
   ENVIRONMENT=production
   ```

### 2.4 Deploy
1. Click "Deploy" o espera a que haga deploy automático
2. Ver logs en "Deployments" tab
3. Obtener URL del backend: `https://tu-backend.up.railway.app`

---

## Paso 3: Deploy Frontend en Vercel

### 3.1 Importar proyecto
1. Ve a [vercel.com](https://vercel.com)
2. "Add New..." → Project
3. Importar desde GitHub
4. Selecciona `dailyfinance-app`

### 3.2 Configuración
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3.3 Variables de Entorno
1. Environment Variables → Add:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api/v1
   ```
   (Reemplaza con la URL real de Railway)

### 3.4 Deploy
1. Click "Deploy"
2. Espera ~2-3 minutos
3. Obtener URL: `https://dailyfinance-app.vercel.app`

---

## Paso 4: Configurar Producción

### 4.1 Actualizar API URL en frontend
Una vez que tengas la URL de Railway:
1. Ve a Railway → Backend → Settings → Variables
2. Actualiza: `NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api/v1`
3. Redeploy frontend en Vercel

### 4.2 Configurar CORS en Backend
```python
# En Railway, el backend ya tiene CORS configurado para localhost:3000
# Si necesitas agregar el dominio de Vercel:
# Actualiza en main.py:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://dailyfinance-app.vercel.app",  # Tu dominio de Vercel
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Solución de Problemas

### Error: "Cannot find module"
```bash
# Verifica que las dependencias estén instaladas
pip install -r requirements.txt
```

### Error: "Connection refused"
- Verifica que el backend esté corriendo
- Verifica la URL de la API en frontend

### Error: "CORS"
- Verifica que el dominio esté en `allow_origins`
- Verifica que uses `https://` no `http://`

### Error: "Database not found"
- Railway: Verifica que `DATABASE_URL` apunte a la DB correcta
- Local: Verifica que `db/dailyfinance.db` exista

---

## URLs de Ejemplo

| Servicio | URL |
|----------|-----|
| Frontend | `https://dailyfinance-app.vercel.app` |
| Backend | `https://backend.railway.app` |
| API Docs | `https://backend.railway.app/docs` |

---

## Actualizaciones Futuras

Cuando hagas cambios:
```bash
git add .
git commit -m "feat: descripción del cambio"
git push origin main
# Railway y Vercel redeployan automáticamente
```

---

## Links Rápidos

- [GitHub](https://github.com)
- [Vercel](https://vercel.com)
- [Railway](https://railway.app)
- [Documentación FastAPI](https://fastapi.tiangolo.com/)
- [Documentación Next.js](https://nextjs.org/docs)