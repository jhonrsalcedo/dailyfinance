# Deployment Guide - Daily Finance App v1.2.0

## Arquitectura Actual

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                        │
│  Next.js 15 + MUI + NextAuth + React Query                  │
│  URL: https://dailyfinance.vercel.app (o custom domain)     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (API calls)
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Vercel/Railway/Render)         │
│  FastAPI + SQLModel                                          │
│  URL: https://backend-productor.vercel.app/api/v1           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (queries)
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (Turso - libSQL)               │
│  libSQL (SQLite-compatible, cloud)                          │
│  URL: libsql://dailyfinance-{id}.turso.io                  │
└─────────────────────────────────────────────────────────────┘
```

---

## URLs de Producción

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | `https://dailyfinance.vercel.app` | App principal |
| **Backend** | *(configurar según deploy)* | API REST |
| **API Docs** | *(configurar según deploy)* | Swagger UI |
| **Base de Datos** | Turso libSQL | Cloud SQLite |
| **GitHub** | `https://github.com/jhonrsalcedo/dailyfinance` | Repositorio |

---

## Proveedores de Base de Datos Soportados

### 1. Turso (libSQL) - RECOMENDADO
**Gratuito: 9GB**

```bash
# Instalar CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Crear base de datos
turso db create dailyfinance

# Obtener URL
turso db show dailyfinance

# Crear token
turso db tokens create dailyfinance
```

**Configuración:**
```env
DATABASE_URL=libsql://dailyfinance-{id}.turso.io
TURSO_AUTH_TOKEN=tu-token-aqui
ENVIRONMENT=production
```

### 2. Neon (PostgreSQL Serverless)
**Gratuito: 500MB**

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname
ENVIRONMENT=production
```

### 3. Railway (PostgreSQL)
**Gratuito: 1GB**

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
ENVIRONMENT=production
```

### 4. SQLite Local (Desarrollo)
**Para desarrollo local únicamente**

```env
DATABASE_URL=sqlite:///db/dailyfinance.db
ENVIRONMENT=development
```

---

## Configuración de Variables de Entorno

### Frontend (Vercel)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXTAUTH_SECRET` | `***` | Secret para NextAuth (NO mostrar en docs) |
| `NEXTAUTH_URL` | `https://dailyfinance.vercel.app` | URL de producción |
| `NEXT_PUBLIC_API_URL` | `https://backend-production.vercel.app/api/v1` | URL del backend |

### Backend

| Variable | Desarrollo | Producción |
|----------|-----------|------------|
| `DATABASE_URL` | `sqlite:///db/dailyfinance.db` | `libsql://dailyfinance-{id}.turso.io` |
| `TURSO_AUTH_TOKEN` | *(vacío)* | `***` |
| `ENVIRONMENT` | `development` | `production` |
| `NEXTAUTH_SECRET` | `your-secret-key` | `***` |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://dailyfinance.vercel.app` |

---

## Flujo de Deploy

### Rama `develop` → Staging
```bash
git checkout develop
git merge feature/tu-feature
git push origin develop
# Vercel: Deploy Preview automático
```

### Rama `main` → Producción
```bash
git checkout main
git merge develop
git tag -a v1.x.x -m "Release v1.x.x"
git push origin main --tags
# Redeploy automático en Vercel/Railway
```

---

## Características de Producción (v1.2.0)

### Autenticación
- **Provider**: NextAuth.js v4
- **Estrategia**: JWT con credentials
- **Duración de sesión**: 7 días
- **Rutas protegidas**: `/transactions`, `/settings`, `/reports`, `/budget`
- **Middleware**: `withAuth` de NextAuth

### Demo Mode
- Usuarios no logueados ven transacciones de ejemplo
- Dashboard muestra datos simulados
- No expone datos reales de otros usuarios

### API Endpoints
| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `POST /auth/login` | ❌ | Login con email/password |
| `POST /auth/register` | ❌ | Registro de usuario |
| `GET /transactions` | ✅ | Lista de transacciones |
| `GET /transactions/stats` | ✅ | Estadísticas mensuales |
| `GET /categories` | ❌ | Lista de categorías |
| `GET /settings` | ✅ | Configuración del usuario |

---

## Solución de Problemas

### Auth no funciona en producción
1. Verificar `NEXTAUTH_SECRET` configurado en Vercel
2. Verificar `NEXTAUTH_URL` apunta al dominio correcto
3. Verificar `NEXT_PUBLIC_API_URL` del backend

### CORS errors
1. Verificar que el backend tenga los origins correctos
2. El frontend debe usar `https://` no `http://`

### Middleware bloqueando usuarios
1. Verificar que usa `withAuth` de NextAuth
2. NO usar jose para verificar tokens manualmente
3. NextAuth usa tokens OPCOS, no JWT estándar

### Demo mode no aparece
1. Verificar estado de sesión (`useSession`)
2. `RecentTransactions` debe renderizar `DemoRecentTransactions` cuando no está logueado

---

## Links Rápidos

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Turso Dashboard](https://console.turso.tech)
- [GitHub Repository](https://github.com/jhonrsalcedo/dailyfinance)

---

## Checklist Pre-Deploy

- [ ] Todos los tests pasan (`npm run test`, `pytest`)
- [ ] TypeScript sin errores (`npm run typecheck`)
- [ ] Lint pasa (`npm run lint`)
- [ ] Variables de entorno configuradas correctamente
- [ ] `NEXTAUTH_SECRET` configurado en Vercel (no usar valores de dev)
- [ ] `TURSO_AUTH_TOKEN` configurado en backend (producción)
- [ ] Commits hechos a `develop`
- [ ] Rama `main` actualizada con tags
- [ ] **NO** exponer tokens o secrets en documentación

---

## Reglas de Seguridad

### ⚠️ NUNCA exponer en documentación:
- Tokens de autenticación
- Secrets de producción
- Credenciales de base de datos
- URLs con credenciales embedidas

### ✅ En documentation usar:
```env
# En lugar de:
DATABASE_URL=libsql://dailyfinance-xxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJ...

# Usar:
DATABASE_URL=libsql://dailyfinance-{id}.turso.io
TURSO_AUTH_TOKEN=***
```

---

## Migración de Versión

### v1.0 → v1.1
- Agregado Onboarding
- Mejor UI/UX

### v1.1 → v1.2
- Fix middleware con `withAuth` de NextAuth
- Demo mode para usuarios no logueados
- Login redirect para usuarios ya autenticados
- Documentación de auth en LEARN_NextJS.md

### v1.2 → v1.2.1
- Version display en Sidebar
- Config centralizado en `config/version.ts`

---

## Versionamiento de la App

### Ubicación
La versión se muestra en el **Sidebar** (abajo del todo).

### Archivos relacionados
```
frontend/config/version.ts    # Constante APP_VERSION
frontend/components/Sidebar.tsx  # Muestra la versión
```

### Configuración de versión
```ts
// frontend/config/version.ts
export const APP_VERSION = '1.2.1'
export const APP_NAME = 'Daily Finance'
```

### Cómo actualizar la versión

**Paso 1**: Editar `frontend/config/version.ts`
```ts
export const APP_VERSION = '1.3.0'
```

**Paso 2**: Commit y tag
```bash
git add .
git commit -m "release: v1.3.0"
git tag v1.3.0
git push origin main --tags
```

**Paso 3**: Vercel redeploya automáticamente
- La nueva versión aparece en ~2-3 minutos
- Se muestra en el Sidebar como `v1.3.0`

### Checklist de Release
- [ ] Actualizar `APP_VERSION` en `config/version.ts`
- [ ] `npm run typecheck` pasa
- [ ] `npm run test` pasa
- [ ] `npm run lint` pasa
- [ ] Commit con mensaje `release: v1.x.x`
- [ ] Tag con `v1.x.x`
- [ ] Push a `main` con tags

### Versionado Semántico (Recomendado)
| Tipo | Ejemplo | Cuándo usar |
|------|---------|-------------|
| **Patch** | v1.2.0 → v1.2.1 | Bug fixes |
| **Minor** | v1.2.0 → v1.3.0 | New features |
| **Major** | v1.2.0 → v2.0.0 | Breaking changes |