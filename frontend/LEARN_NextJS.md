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