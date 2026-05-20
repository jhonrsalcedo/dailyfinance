# Deployment Guide - Daily Finance App v1.2.0

## Arquitectura Actual

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                        │
│  Next.js 15 + MUI + NextAuth + React Query                  │
│  URL: https://dailyfinance.vercel.app (o custom domain)      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (API calls)
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Railway)                        │
│  FastAPI + SQLModel + SQLite/PostgreSQL                      │
│  URL: https://backend.railway.app/api/v1                    │
│  API Docs: https://backend.railway.app/docs                 │
└─────────────────────────────────────────────────────────────┘
```

---

## URLs Actuales de Producción

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | `https://dailyfinance.vercel.app` | App principal |
| **Backend** | `https://backend.railway.app/api/v1` | API REST |
| **API Docs** | `https://backend.railway.app/docs` | Swagger UI |
| **GitHub** | `https://github.com/jhonrsalcedo/dailyfinance` | Repositorio |

---

## Flujo de Deploy (Automático con GitHub Actions)

### Rama `develop` → Deploy de staging
```bash
git checkout develop
git merge feature/tu-feature
git push origin develop
# Vercel: Deploy Preview automático
```

### Rama `main` → Deploy de producción
```bash
git checkout main
git merge develop
git tag -a v1.x.x -m "Release v1.x.x"
git push origin main --tags
# Vercel: Deploy producción automático
# Railway: Redeploy automático
```

---

## Configuración de Variables de Entorno

### Frontend (Vercel)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXTAUTH_SECRET` | `xxxxxxxxxxxx` | Secret para NextAuth |
| `NEXTAUTH_URL` | `https://dailyfinance.vercel.app` | URL de producción |
| `NEXT_PUBLIC_API_URL` | `https://backend.railway.app/api/v1` | URL del backend |

### Backend (Railway)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `sqlite:///db/dailyfinance.db` | Local development |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Producción (PostgreSQL) |
| `ENVIRONMENT` | `production` | Modo producción |
| `SECRET_KEY` | `xxxxxxxxxxxx` | Secret para JWT |

---

## Características de Producción (v1.2.0)

### Autenticación
- **Provider**: NextAuth.js v4
- **Estrategia**: JWT con credentials
- **Duración de sesión**: 7 días
- **Rutas protegidas**: `/transactions`, `/settings`, `/reports`, `/budget`
- **Middleware**: `withAuth` de NextAuth (protección automática)

### Demo Mode
- Usuarios no logueados ven transacciones de ejemplo
- Dashboard muestra datos simulados
- Incentiva registro sin exponer datos reales

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
1. Verificar `NEXTAUTH_SECRET` está configurado en Vercel
2. Verificar `NEXTAUTH_URL` apunta al dominio correcto
3. Verificar `NEXT_PUBLIC_API_URL` del backend

### CORS errors
1. Verificar que el backend tenga los origins correctos
2. El frontend debe usar `https://` no `http://`
3. Revisar cookies en el browser (SameSite settings)

### Middleware bloqueando usuarios
1. Verificar que el middleware usa `withAuth` de NextAuth
2. NO intentar verificar tokens manualmente con jose
3. NextAuth usa tokens OPCOS, no JWT estándar

### Demo mode no aparece
1. Verificar que el dashboard muestra datos demo cuando `status === 'unauthenticated'`
2. Verificar que `RecentTransactions` renderiza `DemoRecentTransactions`

---

## Links Rápidos

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Railway Dashboard](https://railway.app/dashboard)
- [GitHub Repository](https://github.com/jhonrsalcedo/dailyfinance)
- [Swagger API Docs](https://backend.railway.app/docs)

---

## Checklist Pre-Deploy

- [ ] Todos los tests pasan (`npm run test`, `pytest`)
- [ ] TypeScript sin errores (`npm run typecheck`)
- [ ] Lint pasa (`npm run lint`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Variables de entorno configuradas en Railway
- [ ] CORS configurado para dominios de producción
- [ ] NEXTAUTH_SECRET configurado (no usar el de desarrollo)
- [ ] Commits hechos a `develop`
- [ ] Rama `main` actualizada con tags

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