# Daily Finance App - AI Agent Instructions

## Descripción del Proyecto
Daily Finance App es una aplicación de finanzas personales para control de gastos diarios con categorías, gráficos y estadísticas.

## Stack Tecnológico

### Frontend
- Next.js 14/15 (App Router)
- MUI v5 (@mui/material)
- React Hook Form + Zod
- React Query (@tanstack/react-query)
- Recharts
- TypeScript
- Vitest (testing)

### Backend
- FastAPI (Python)
- SQLModel (ORM)
- Pydantic v2
- SQLite (desarrollo)
- Pytest (testing)
- Python-Jose (JWT)
- Passlib + Bcrypt (password hashing)

### DevOps
- Docker + docker-compose
- Husky (pre-commit hooks)
- GitHub Actions (CI/CD)
- ESLint + TypeScript

### Testing
- **Unit**: Vitest (frontend), Pytest (backend)
- **E2E**: Playwright

---

## Reglas de Código

### Generales
- Sin punto y coma (TypeScript y Python)
- Comillas simples
- Máximo 100-150 líneas por componente/función
- No comentarios en código (documentar en LEARN_*.md)
- Type hints estrictos (TypeScript strict / Python type hints)

### Frontend
- Componentes funcionales con TypeScript
- Usar React Query para estado de servidor
- Validación de formularios con Zod

### Backend
- Funciones máximo 50 líneas
- Type hints en todas las funciones
- Usar SQLModel para modelos de DB

### Testing
- Tests obligatorios antes de cada commit
- Coverage mínimo 80%
- AAA Pattern: Arrange → Act → Assert

---

## Comunicación: Plan Mode vs Construcción

### Plan Mode (Solo Lectura)
- ✅ Leer archivos
- ✅ Analizar código  
- ✅ Proponer planes
- ❌ NO editar archivos
- ❌ NO ejecutar comandos

### Construcción (Ejecución)
- ✅ Crear/editar archivos
- ✅ Ejecutar comandos
- ✅ Verificar funciona
- ✅ Actualizar memoria

### Cómo cambiar de modo
- Usuario dice: "si, procede" o "ejecutar" o "continuar"
- Ejecutar inmediatamente sin esperar confirmación adicional

---

## Protocolo de Memoria (Engram)

1. **ANTES:** `mem_search` para buscar contexto previo
2. **DURANTE:** `mem_save` después de decisiones técnicas
3. **DESPUÉS:** `mem_session_summary` al cerrar sesión

---

## Definition of Done (DoD)

- Código compila sin errores
- Funcionalidad implementada
- Documentación actualizada
- Git commit realizado

---

## Scripts Disponibles

### Frontend
```bash
cd frontend
npm run dev          # Desarrollo
npm run build        # Producción
npm run test         # Tests (Vitest)
npm run test:ui     # Tests con UI
npm run test:cov    # Tests con coverage
npm run test:e2e    # E2E tests (Playwright)
npm run lint        # Linting
npm run typecheck   # TypeScript
npm run check       # Lint + TypeScript
```

### Backend
```bash
cd backend
make install        # Instalar dependencias
make run            # Iniciar servidor
make test           # Tests con pytest
make test-cov       # Tests con coverage
```

### Pre-commit
```bash
npx lint-staged     # Ejecutar todos los checks
```

---

## Endpoints de la API

### Autenticación (JWT)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Registrar usuario |
| POST | `/api/v1/auth/login` | ❌ | Login → JWT |
| GET | `/api/v1/auth/me` | ✅ | Datos usuario actual |
| POST | `/api/v1/auth/logout` | ✅ | Cerrar sesión |

### Transacciones
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/transactions` | ❌ | Listar transacciones |
| GET | `/api/v1/transactions/stats` | ❌ | Estadísticas mensuales |
| GET | `/api/v1/transactions/export` | ❌ | Exportar CSV |
| POST | `/api/v1/transactions` | ✅ | Crear transacción |
| DELETE | `/api/v1/transactions/{id}` | ✅ | Eliminar transacción |

### Categorías
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/categories` | ❌ | Listar categorías |
| POST | `/api/v1/categories` | ✅ | Crear categoría |
| PUT | `/api/v1/categories/{id}` | ✅ | Actualizar categoría |
| DELETE | `/api/v1/categories/{id}` | ✅ | Eliminar categoría |

### Otros
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/payment-methods` | ❌ | Métodos de pago |
| GET/POST | `/api/v1/settings` | ❌ | Configuración (salario) |
| GET/POST | `/api/v1/budget` | ❌ | Presupuesto |

---

## Puertos
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Base de Datos

### Configuración Agnóstica
El proyecto usa abstracción de base de datos. Compatible con:
- **SQLite** (desarrollo local)
- **PostgreSQL** (Neon, Railway, Supabase)
- **MySQL** (PlanetScale)

### Variables de Entorno
```bash
# Desarrollo (SQLite por defecto)
DATABASE_URL=sqlite:///db/dailyfinance.db

# Producción (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Proveedores Gratuitos Recomendados
| Proveedor | Tier | Database | Link |
|-----------|------|----------|------|
| Neon | 500MB | PostgreSQL | neon.tech |
| Turso | 9GB | libSQL | turso.tech |
| Railway | 1GB | PostgreSQL | railway.app |
| Supabase | 500MB | PostgreSQL | supabase.com |

### Estructura de Archivos
- `db/dailyfinance.db` - SQLite local
- `app/config.py` - Factory pattern para engines
- `.env.example` - Plantilla de variables

---

## Categorías Predefinidas

1. Ingresos
2. Vivienda
3. Transporte
4. Alimentación
5. Entretenimiento
6. Salud
7. Veh��culo
8. Familia
9. Deudas/Crédito
10. Misceláneos

---

## Métodos de Pago

1. Efectivo
2. Tarjeta Débito
3. Tarjeta Crédito

---

## Formato de Moneda
Los montos se muestran en Pesos Colombianos (COP):
- $50.000
- $1.500.000
- $7.878.800

---

## Autenticación

### Stack
- **Proveedor**: NextAuth.js (Auth.js)
- **Estrategia**: JWT con credentials
- **Frontend**: React con SessionProvider

### Estructura de Archivos
| Archivo | Descripción |
|---------|-------------|
| `app/api/auth/[...nextauth]/route.ts` | Handler de NextAuth |
| `components/Providers.tsx` | SessionProvider + React Query |
| `utils/api.ts` | Axios con interceptor JWT |
| `types/next-auth.d.ts` | TypeScript types |

### Componentes queusan Auth
- `Sidebar.tsx` - `useSession()`
- `TopBar.tsx` - `useSession()` + `signOut()`
- `login/page.tsx` - `signIn()` de NextAuth
- `Dashboard (page.tsx)` - `useSession()`
- `UserProfile.tsx` - `api` (axios interceptor)
- `OnboardingChecker.tsx` - `useSession()`

### Flujo de Autenticación
1. Usuario entra email/password en `/login`
2. `signIn('credentials')` → NextAuth valida contra backend
3. Backend retorna JWT → NextAuth guarda en cookie de sesión
4. `session.accessToken` contiene el JWT para llamadas API
5. `utils/api.ts` interceptor agrega `Bearer token`

### Verificación de Auth
```typescript
const { status } = useSession()
const isAuthenticated = status === 'authenticated'
```

### Llamadas API Autenticadas
```typescript
import api from '@/utils/api'
const { data } = await api.get('/endpoint')
```

### Logout
```typescript
import { signOut } from 'next-auth/react'
await signOut({ redirect: false })
router.push('/')
```

### Variables de Entorno
```bash
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Códigos de Error
| Código | Significado |
|--------|-------------|
| 401 | No autenticado / Token expirado |
| 403 | Sin permisos |
| 422 | Credenciales inválidas |

### Modo Demo (Sin Auth)
Los visitantes ven datos de ejemplo. Para habilitar features completas, hacer login.

---

## Git Workflow

### Flujo de Commit
```bash
# 1. Haz cambios en el código
git add .

# 2. Commit → Se ejecuta pre-commit automáticamente
git commit -m "feat: descripción"
#       ↓
#  [HUSKY] Ejecuta lint-staged
#       ↓
#  Si pasa → Commit creado ✓
#  Si falla → Muestra errores → Corrige y vuelve a intentar
```

### Hooks Locales Configurados
| Hook | Qué hace | Si falla |
|------|----------|----------|
| `pre-commit` | lint + typecheck + tests | Bloquea commit |

### CI/CD en GitHub (con cada push)
Jobs: lint-and-typecheck → build → tests

---

## Recursos Adicionales

- `DEVELOPMENT_GUIDE.md` - Guía completa de desarrollo
- `db/LEARN_SQL.md` - Conceptos de SQL y diseño de DB
- `backend/LEARN_FastAPI.md` - Patrones de FastAPI
- `frontend/LEARN_NextJS.md` - Patrones de Next.js
- `frontend/LEARN_MUI_RESPONSIVE.md` - Estándares responsive MUI
- `docker/LEARN_Docker.md` - Comandos y optimización Docker

---

## Workflow de Desarrollo

1. **Crear branch**: `git checkout -b feature/nueva-feature`
2. **Desarrollar**: Implementar feature
3. **Testing**: Ejecutar `npm run test` y `make test`
4. **Pre-commit**: Verificar que husky pase
5. **Commit**: `git commit -m "feat: descripción"`
6. **Push**: `git push origin feature/nueva-feature`
7. **PR**: Crear Pull Request en GitHub