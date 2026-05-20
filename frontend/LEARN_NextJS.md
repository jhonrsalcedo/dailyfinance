# LEARN_NextJS.md
# Patrones y Decisiones Frontend (Next.js 15 + MUI)

## 1. Comandos de Ejecución

```bash
cd frontend
make install   # npm install
make dev       # npm run dev (http://localhost:3000)
make build     # npm run build
```

## 2. Gestión de Estado

### React Query (Server State)
- Fetcheo y caché de datos del backend
- Query keys: `['recurso']` o `['recurso', { filtros }]`
- Stale time por defecto: no configurado (comportamiento infinito hastamutación)

### Axios (HTTP Client)
- Instancia configurada en `utils/api.ts`
- Headers automáticos para Content-Type
- Interceptor para JWT (automatic add Bearer token)

### Environment
- Local: `http://localhost:8000/api/v1`
- Producción: `NEXT_PUBLIC_API_URL` en Vercel

---

## 3. Patrón de Datos (React Query + API)

### Estructura de queryKey
```ts
// Standard: [recurso]
['transactions']
['categories']
['settings']

// Con filtros
['transactions', { mes: '2026-05' }]
['transactions', { anio: 2026 }]
```

### Patrón en Componentes
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/utils/api'

// READ - useQuery
const { data, isLoading, error } = useQuery({
  queryKey: ['transactions'],
  queryFn: () => api.get('/transactions').then(r => r.data),
})

// CREATE/UPDATE - useMutation
const mutation = useMutation({
  mutationFn: (data) => api.post('/transactions', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
  },
})

// DELETE - useMutation con cleanup
const deleteMutation = useMutation({
  mutationFn: (id: number) => api.delete(`/transactions/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
  },
})
```

### Recursos Disponibles
| Key | Endpoint | Tipo |
|-----|----------|------|
| `transactions` | `/transactions` | Transaction[] |
| `categories` | `/categories` | Category[] |
| `settings` | `/settings` | UserSettings |
| `stats` | `/transactions/stats` | StatsResponse |
| `payment-methods` | `/payment-methods` | PaymentMethod[] |
| `budget` | `/budget` | Budget[] |

---

## 4. Componentes UI (MUI v5)

- Componentes MUI configurados en ThemeRegistry
- Alias: `@/*` → `./`
- Responsive: ver `LEARN_MUI_RESPONSIVE.md`

### Estructura de Componentes

#### Page (Página completa)
```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api'
import Loading from '@/components/Loading'
import { Skeleton } from '@/components/skeletons/PageSkeleton'

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.get('/transactions').then(r => r.data),
  })

  if (isLoading) return <Skeleton />

  return (
    // UI
  )
}
```

#### Form Component (Formulario)
```tsx
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/utils/api'
import Loading from '@/components/Loading'

export default function TransactionForm() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ amount: '', description: '' })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })

  const mutation = useMutation({
    mutationFn: (data) => api.post('/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return (
    // Form UI
  )
}
```

---

## 5. Skeletons (Estados de Carga)

Cada página tiene su skeleton personalizado:
- `DashboardSkeleton.tsx` - Dashboard
- `TransactionsSkeleton.tsx` - Transacciones
- `SettingsSkeleton.tsx` - Settings
- `BudgetSkeleton.tsx` - Presupuesto
- `ReportsSkeleton.tsx` - Reportes

Por qué separados: layouts muy diferentes entre páginas.

---

## 6. Estructura de Archivos

```
frontend/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── login/page.tsx        # Login/Registro
│   ├── transactions/page.tsx # Transacciones
│   ├── budget/page.tsx       # Presupuesto
│   ├── reports/page.tsx      # Reportes
│   ├── settings/page.tsx    # Settings
│   └── api/auth/           # NextAuth route
├── components/
│   ├── TransactionForm.tsx
│   ├── RecentTransactions.tsx
│   ├── DashboardBalance.tsx
│   ├── CategoryChart.tsx
│   ├── MonthlyTrend.tsx
│   ├── UserProfile.tsx
│   ├── Loading.tsx
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   └── skeletons/          # 5 skeletons por página
├── hooks/
│   └── useAuth.ts          # Auth helpers
├── utils/
│   ├── api.ts             # Axios instance
│   ├── currency.ts        # Format currency
│   └── i18n.ts           # Translations
└── models/
    └── index.ts           # TypeScript types
```

---

## 7. Errores Comunes

### No se actualiza después de mutation
```ts
// ❌ Falta invalidar
const mutation = useMutation({
  mutationFn: (data) => api.post('/transactions', data),
})

// ✅ Invalidar queries relacionados
const mutation = useMutation({
  mutationFn: (data) => api.post('/transactions', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
  },
})
```

### Loading state incorrecto
```ts
// ❌ isLoading puede ser true antes de fetmear
if (isLoading) return <Loading />

// ✅ Verificar data existe
if (isLoading) return <Loading />
if (!data) return <Loading />
```

### No manejar errores
```ts
// ❌ Sin manejo
const { data } = useQuery({ queryKey: ['transactions'] })

// ✅ Con error
const { data, error, isError } = useQuery({
  queryKey: ['transactions'],
  queryFn: () => api.get('/transactions').then(r => r.data),
})
if (isError) return <Typography color="error">Error: {error.message}</Typography>
```

---

## 8. Checklist de Nuevas Pages

- [ ] Crear `page.tsx` en `app/[seccion]/`
- [ ] Agregar a Sidebar navigation
- [ ] Crear skeleton si es necesario
- [ ] Usar patrón de queryKey consistente
- [ ] Invalidar queries en mutations
- [ ] Manejar estados isLoading/isError
- [ ] Probar responsive (móvil + PC)

---

## 9. Protección de Rutas (Auth)

### Patrón: Redirect Inmediato

Para páginas que requieren autenticación, usar redirect a `/login`:

```tsx
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return <Skeleton />
  }

  return <PageContent />
}
```

### Por qué Redirect (vs UI custom)

| Aspecto | Redirect | UI Custom |
|--------|----------|----------|
| Seguridad | ✅ Mismo nivel (backend proteje API) | ✅ Mismo nivel |
| UX | ✅ Consistente | ❌ Inconsistente |
| Código | ✅ Mínimo | ❌ Más mantener |
| Mantenimiento | ✅ Un patrón | ❌ Personalizado |

### Sidebar (Items Deshabilitados)

El Sidebar maneja navegación con items deshabilitados:

```tsx
// items requieren auth
const needsAuth = item.requiresAuth
const isDisabled = needsAuth && !isAuthenticated

// UI deshabilitada
<ListItemButton
  component={Link}
  href={isDisabled ? '#' : item.href}
  onClick={() => handleItemClick(item)}
  disabled={isDisabled}
>
```

### Backend (Protección Real)

La seguridad real está en el backend - las API rechazan requests sin JWT válido:

```python
# auth.py - get_current_user
def get_current_user(token: str = Depends(oauth2_scheme)):
    # Valida JWT o lanza 401
    # Si no hay token → 401 Unauthorized
```

No importa qué haga el frontend - el backend siempre proteje los datos.

---

## 10. Regla Estándar: Nueva Sección Protegida

### PARA CADA NUEVA SECCIÓN que requiera autenticación:

**Paso 1: Agregar en Sidebar.tsx**
```tsx
// En navItems (líneas 33-45)
{ label: 'NuevaSección', labelKey: 'nav.nuevaSeccion', icon: <Icon />, href: '/nuevaSeccion', requiresAuth: true },
```

**Paso 2: Agregar en middleware.ts**
```tsx
// En matcher
matcher: ['/dashboard/:path*', '/settings/:path*', '/transactions/:path*', '/reports/:path*', '/budget/:path*', '/nuevaSeccion/:path*'],
```

**Paso 3: NO crear código custom en la page**
- El Sidebar maneja el estado deshabilitado
- El middleware maneja el redirect por URL
- El backend maneja la protección real de datos

### Por qué este patrón

| Componente | Responsabilidad |
|------------|---------------|
| **Sidebar** | UI deshabilitada + tooltip + click redirect |
| **middleware** | Redirect por URL directa |
| **Backend** | Protección real de datos (API) |

### Checklist paraNueva Sección

- [ ] Agregar en navItems del Sidebar con `requiresAuth: true`
- [ ] Agregar ruta en matcher de middleware.ts
- [ ] NO modificar la page (no hacer custom UI)

---

## 11. Reglas de Código Limpio

### Imports
- ✅ Usar desde `utils/api.ts` - NO hardcodear `API_BASE_URL`
- ✅ NO duplicar imports (verificar antes de importar)

### Patterns Correctos
```ts
// ✅ CORRECTO
import api from '@/utils/api'
const { data } = await api.get('/endpoint')

// ❌ INCORRECTO
import axios from 'axios'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const { data } = await axios.get(`${API_BASE_URL}/endpoint`)
```

### Antes de Commit
```bash
# Verificar sin errores
npm run typecheck
npm run lint
npm run test

# Buscar console.log
grep -r "console.log" --include="*.ts" --include="*.tsx"
```

### Checklist de Limpieza
- [ ] Sin `console.log` de debug
- [ ] Sin imports sin usar
- [ ] Sin URLs hardcodeadas (usar process.env)
- [ ] Sin código comentado
- [ ] TypeScript sin errores (`npm run typecheck`)
- [ ] ESLint pasa (`npm run lint`)

---

## 12. Flujo de Deploy a Producción

### Ramas
- `develop` → Desarrollo (localhost + URLs dev)
- `main` → Producción (Render + Vercel)

### Flujo Estándar

```bash
# 1. Trabajar en develop
git checkout develop
# ...hacer cambios...

# 2. Verificar localmente
npm run check     # lint + typecheck
npm run test    # tests

# 3. Push a develop
git add .
git commit -m "feat: descripción"
git push origin develop

# 4. Después de verificar que todo funciona → PREGUNTAR:
# "¿Listo para enviar a producción?"

# 5. Si usuario confirma:
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin main --tags
```

### Regla: Preguntar Antes de Production Deploy

> **IMPORTANT**: Después de push exitoso a develop, SIEMPRE preguntar al usuario:
> 
> - "¿Todo funciona bien en desarrollo?"
> - "¿Listo para enviar a producción?"
> 
> Solo proceder con merge + tag + push si el usuario confirma explícitamente.

### Checklist Pre-Production
- [ ] `npm run check` pasa (lint + typecheck)
- [ ] `npm run test` pasa
- [ ] `pytest` pasa (backend)
- [ ] Usuario confirmó → proceder

---

## 13. Patrón de Arquitectura

### Frontend: Page + Components

**Cuándo aplicar:**
- Cuando una page tiene más de 300-400 líneas
- Cuando hay secciones UI repetitivas (como summary cards)

**Estructura:**
```
app/
├── transactions/
│   ├── page.tsx              # Lógica de página + state
│   └── components/
│       ├── TransactionSummary.tsx
│       └── TransactionList.tsx
├── budget/
│   ├── page.tsx
│   └── components/
│       └── BudgetSummary.tsx
```

**Qué extraer:**
- ✅ Summary cards (tarjetas de total)
- ✅ Listas repetitivas
- ✅ Forms complejos

**Qué NO extraer:**
- ❌ Hooks de datos (useQuery/useMutation)
- ❌ Lógica de validación
- ❌ Estado de la página

### Backend: Mantener como está

**Por qué no refactorizar:**
- FastAPI ya organiza por rutas (`/routes/*.py`)
- Cada endpoint es autocontained
- SQLModel ya simplifica el acceso a DB
- No hay UI reutilizable interna

**Patrón actual:**
```
backend/app/routes/
├── transactions.py    # CRUD completo (150-200 líneas)
├── auth.py           # Autenticación
├── settings.py       # Configuración
└── ...
```

### Resumen

| Capa | Patrón | Aplicar |
|------|--------|---------|
| **Frontend** | Page + Components | Cuando page > 400 líneas |
| **Backend** | Mantener (route por archivo) | Siempre |

## 23. Gestor de Paquetes: npm vs pnpm

### Comparación

| Gestor | Velocidad | Espacio | Recomendación |
|--------|-----------|---------|----------------|
| **npm** | Medio | Grande | Proyectos pequeños |
| **pnpm** | Rápido | Pequeno (hard links) | Proyectos grandes/monorepo |
| **yarn** | Rápido | Medio | Alternativa a npm |

### Migración de npm a pnpm

#### Pasos para Migrar

```bash
# 1. Instalar pnpm globalmente
npm install -g pnpm

# 2. En la carpeta del proyecto (frontend)
cd frontend

# 3. Eliminar node_modules y package-lock.json
rm -rf node_modules
rm package-lock.json

# 4. Instalar con pnpm
pnpm install

# 5. Probar que funciona
pnpm run dev
pnpm run build
pnpm run typecheck
pnpm run test
```

#### Si falla el rollback

```bash
# Volver a npm es simple
rm -rf node_modules pnpm-lock.yaml
npm install
```

#### Actualizar CI/CD (GitHub Actions)

```yaml
# En .github/workflows/...
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

#### Scripts actualizados

| Antes (npm) | Después (pnpm) |
|-------------|----------------|
| `npm install` | `pnpm install` |
| `npm run dev` | `pnpm run dev` |
| `npm run build` | `pnpm run build` |
| `npm test` | `pnpm test` |

### Cuándo usar pnpm

| Escenario | Recomendación |
|-----------|---------------|
| Proyecto nuevo pequeño | npm (está bien) |
| Proyecto nuevo grande | pnpm |
| Monorepo | pnpm obligatorio |
| E-commerce | pnpm |
| daily finance app existente | npm (no necesario cambiar) |

### Nota sobre este proyecto

**El proyecto actual funciona bien con npm.** El cambio a pnpm es opcional y no provide beneficios significativos para un proyecto de este tamaño.

---

## 24. Middleware de Autenticación (NextAuth)

### Patrón Correcto: `withAuth` de NextAuth

**IMPORTANTE**: Usar SIEMPRE `withAuth` de NextAuth, NO intentar verificar tokens manualmente.

```typescript
// ✅ CORRECTO - Usar withAuth de NextAuth
// frontend/middleware.ts
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/transactions/:path*',
    '/settings/:path*',
    '/reports/:path*',
    '/budget/:path*',
  ],
}
```

### Por qué NO hacer verificación manual

| Intento | Problema |
|---------|----------|
| ❌ `jwtVerify(token)` con jose | NextAuth usa tokens OPCOS (no JWT estándar) |
| ❌ `jwt.decode(token)` | Los tokens de NextAuth no son decodificables así |
| ❌ `jwt.verify()` | Los tokens no son JWT firmados por nosotros |

**NextAuth maneja internamente la validación del token**. Intentar hacerlo manualmente rompe la autenticación.

### Rutas Públicas vs Protegidas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | 🟡 Pública (demo) | Dashboard con datos demo si no está logueado |
| `/login` | 🟢 Pública | Página de login/registro |
| `/transactions/*` | 🔴 Protegida | Requiere autenticación |
| `/settings/*` | 🔴 Protegida | Requiere autenticación |
| `/reports/*` | 🔴 Protegida | Requiere autenticación |
| `/budget/*` | 🔴 Protegida | Requiere autenticación |

### Agregar Nueva Ruta Protegida

```typescript
// En frontend/middleware.ts
export const config = {
  matcher: [
    '/transactions/:path*',
    '/settings/:path*',
    '/reports/:path*',
    '/budget/:path*',
    '/nuevaRuta/:path*',  // ← Agregar aquí
  ],
}
```

### Checklist para Cambios de Auth

**ANTES de implementar cualquier feature relacionada con auth:**

- [ ] Leer la documentación oficial de NextAuth
- [ ] Verificar si NextAuth usa tokens JWT o opacos
- [ ] Implementar usando `withAuth` (si aplica)
- [ ] NO intentar verificar tokens manualmente
- [ ] Testear flujo completo:
  - Login
  - Dashboard
  - Transacciones
  - Settings
  - Logout
- [ ] Verificar que usuarios existentes siguen funcionando

**Después de cualquier cambio de auth:**

- [ ] `npm run typecheck` pasa
- [ ] `npm run test` pasa
- [ ] Login funciona con usuario existente
- [ ] Logout funciona correctamente
- [ ] Rutas protegidas redirigen correctamente

---

## 25. Versionamiento de la App

### Ubicación de la Versión
La versión se muestra en el **Sidebar** (abajo del todo).

### Archivos del Sistema de Versión
```
frontend/
├── config/
│   └── version.ts    # APP_VERSION, APP_NAME
└── components/
    └── Sidebar.tsx   # Muestra v{APP_VERSION}
```

### Configuración de Versión
```typescript
// frontend/config/version.ts
export const APP_VERSION = '1.2.1'
export const APP_NAME = 'Daily Finance'
export const APP_DESCRIPTION = 'Gestión Personal de Finanzas'
```

### Cómo Actualizar la Versión

**1. Editar `config/version.ts`:**
```typescript
export const APP_VERSION = '1.3.0'
```

**2. Commit y tag:**
```bash
git add .
git commit -m "release: v1.3.0"
git tag v1.3.0
git push origin main --tags
```

**3. Vercel redeploya automáticamente** (~2-3 min)

### Checklist de Release
- [ ] Actualizar `APP_VERSION` en `config/version.ts`
- [ ] `npm run typecheck` pasa
- [ ] `npm run test` pasa
- [ ] `npm run lint` pasa
- [ ] Commit con mensaje `release: v1.x.x`
- [ ] Tag con `v1.x.x`
- [ ] Push a `main` con tags (`--tags`)

### Versionado Semántico
| Tipo | Ejemplo | Cuándo |
|------|---------|--------|
| **Patch** | v1.2.0 → v1.2.1 | Bug fixes |
| **Minor** | v1.2.0 → v1.3.0 | Nuevas features |
| **Major** | v1.2.0 → v2.0.0 | Breaking changes |

### Historial de Versiones
| Versión | Fecha | Cambios |
|---------|-------|---------|
| v1.2.1 | 2026-05-20 | Version display en Sidebar |
| v1.2.0 | 2026-05-20 | Demo mode, middleware fix |
| v1.1.0 | - | Onboarding, UI/UX |
| v1.0.0 | - | Versión inicial | |