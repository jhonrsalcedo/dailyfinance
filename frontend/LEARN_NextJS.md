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