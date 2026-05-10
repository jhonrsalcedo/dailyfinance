---
name: dailyfinance-frontend
description: Reglas para Frontend Next.js + MUI + React Hook Form
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: frontend
---

# Reglas para Frontend (Next.js + MUI + React Hook Form + Zod)

## Stack
- Next.js 15 (App Router)
- MUI v5 (@mui/material)
- React Hook Form
- Zod (validación)
- Recharts (gráficos)
- TypeScript

## Reglas de Código
- Sin punto y coma (semi: false)
- Comillas simples
- Componentes máximo 150 líneas
- No usar comentarios en el código

## Formularios
- Usar React Hook Form (useForm)
- Validación con Zod schema
- zodResolver para integración

## Ejemplo de Schema Zod
```typescript
import { z } from 'zod'
export const transactionSchema = z.object({
  amount: z.number().positive(),
  category_id: z.number().min(1),
  method_id: z.number().min(1),
})
```

## Componentes MUI
- Usar Grid, Card, TextField, Button, MenuItem
- Tema personalizado en theme/theme.ts
- formatCurrencyCOP para montos

## Estructura
```
frontend/
├── components/    # Componentes React
├── schemas/       # Schemas Zod
├── theme/         # Tema MUI
└── utils/         # Utilidades (currency)
```

## Documentación
- Patrones en LEARN_NextJS.md

## Auth Protection (Regla Estándar)

### Nueva Sección Protegida

Para proteger una ruta de usuario no autenticado:

**1. Sidebar.tsx** - Agregar en navItems:
```typescript
{ label: 'NuevaSección', labelKey: 'nav.nuevaSeccion', icon: <Icon />, href: '/nuevaSeccion', requiresAuth: true }
```

**2. middleware.ts** - Agregar en matcher:
```typescript
matcher: ['/transactions/:path*', '/reports/:path*', '/nuevaSeccion/:path*']
```

**3. NO modificar la page** - El Sidebar maneja el comportamiento

### Código Limpio (Antes de Commit)
```bash
npm run check     # lint + typecheck
npm run test     # tests

# NO usar console.log
# NO hardcodear URLs - usar process.env
# NO duplicar imports
```

---

## Deployment
- Ramas: `develop` (dev) → `main` (prod)
- Después de push a develop, PREGUNTAR: "¿Listo para enviar a producción?"
- Si usuario confirma:
  - git merge develop
  - git tag -a v1.0.0 -m "Release 1.0.0"
  - git push origin main --tags

---

## Responsive Tables (Regla Estándar)

### Problema Común
Cuando una tabla desaparece en tablet (iPad Air), revisar breakpoints.

**Regla Estándar**:
| Elemento | Breakpoint | Descripción |
|----------|-----------|-------------|
| Tabla | `md: 'block'` (900px+) | Muestra tabla en tablets landscape + desktop |
| isMobile | `down('md')` | Cards en móvil + tablet (0-899px) |

```typescript
// ❌ INCORRECTO
const isMobile = useMediaQuery(theme.breakpoints.down('sm'))  // solo 0-599px
sx={{ display: { xs: 'none', lg: 'block' } }}  // tabla solo en 1200px+

// ✅ CORRECTO
const isMobile = useMediaQuery(theme.breakpoints.down('md'))  // 0-899px = móvil + tablet
sx={{ display: { xs: 'none', md: 'block' } }}  // tabla en 900px+ (tablet landscape + desktop)
```

### Breakpoints MUI
| Breakpoint | Rango | Dispositivo |
|-----------|-------|------------|
| xs | 0-599px | Teléfono |
| sm | 600-899px | iPad mini, tablet pequeña |
| md | 900-1199px | **iPad Air**, tablet |
| lg | 1200px+ | Laptop/Desktop |

### Hook Recomendado: useDeviceType
```typescript
// hooks/useDeviceType.ts
import { useTheme, useMediaQuery } from '@mui/material'

export function useDeviceType() {
  const theme = useTheme()
  return {
    isMobile: useMediaQuery(theme.breakpoints.down('sm')),
    isTablet: useMediaQuery(theme.breakpoints.between('sm', 'md')),
    isDesktop: useMediaQuery(theme.breakpoints.up('md')),
  }
}
```

### Checklist Responsive
- [ ] Tabla visible en iPad Air (900px+)
- [ ] Cards visibles en móvil (isMobile con down('md'))
- [ ] Buscar `display:.*xs:.*none` antes de commit
- [ ] Probar en DevTools con resolución de tablet

---

## Snackbar Global (Notificaciones)

### Estructura
```typescript
// hooks/useSnackbar.tsx
'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

interface SnackbarContextType {
  open: boolean
  message: string
  severity: SnackbarSeverity
  show: (message: string, severity?: SnackbarSeverity) => void
  hide: () => void
}

const SnackbarContext = createContext<SnackbarContextType>({
  open: false, message: '', severity: 'success', show: () => {}, hide: () => {},
})

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    open: false, message: '', severity: 'success' as SnackbarSeverity,
  })
  const show = useCallback((message: string, severity = 'success') => {
    setState({ open: true, message, severity })
  }, [])
  const hide = useCallback(() => setState(prev => ({ ...prev, open: false })), [])
  return (
    <SnackbarContext.Provider value={{ ...state, show, hide }}>
      {children}
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() { return useContext(SnackbarContext) }
```

### Provider (ThemeRegistry)
```typescript
// components/ThemeRegistry.tsx
import { SnackbarProvider } from '@/hooks/useSnackbar'
import { GlobalSnackbar } from '@/components/GlobalSnackbar'

<QueryClientProvider client={queryClient}>
  <SnackbarProvider>
    {/* app content */}
    <GlobalSnackbar />
  </SnackbarProvider>
</QueryClientProvider>
```

### Uso en Mutations
```typescript
const { show } = useSnackbar()

const mutation = useMutation({
  mutationFn: () => api.post('/endpoint', data),
  onSuccess: () => show('Operación exitosa', 'success'),
  onError: () => show('Error al operar', 'error'),
})
```

### Errores a Evitar
- ✅ NO usar alert() - usar showSnackbar.show()
- ✅ NO crear estado local para Snackbar - usar hook global
- ✅ SIEMPRE agregar feedback en onSuccess/onError

---

## DeleteConfirmDialog (Confirmación de Eliminación)

### Componente Reutilizable
```tsx
// components/DeleteConfirmDialog.tsx
'use client'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

interface DeleteConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirmDialog({ ... }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 }}}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <WarningIcon color="error" sx={{ fontSize: 28 }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.primary', fontSize: 16 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined" disabled={isLoading}>{cancelText}</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={isLoading} autoFocus>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  )
}
```

### Uso en Página (Patrón Estándar)

```tsx
// imports
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { useSnackbar } from '@/hooks/useSnackbar'

// estado
const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null; name: string }>({
  open: false, id: null, name: '',
})

// función para abrir dialog
const handleDeleteClick = (id: number, name: string) => {
  setDeleteConfirm({ open: true, id, name })
}

// función de confirmación
const handleConfirmDelete = async () => {
  try {
    await api.delete(`/endpoint/${deleteConfirm.id}`)
    // actualizar lista
    showSnackbar.show('Eliminado correctamente', 'success')
  } catch (error) {
    showSnackbar.show('Error al eliminar', 'error')
  } finally {
    setDeleteConfirm({ open: false, id: null, name: '' })
  }
}

// UI - botón de eliminar
<IconButton onClick={() => handleDeleteClick(item.id, item.name)}>
  <DeleteIcon />
</IconButton>

// UI - dialog al final del componente
<DeleteConfirmDialog
  open={deleteConfirm.open}
  title="Eliminar"
  message={`¿Estás seguro de eliminar "${deleteConfirm.name}"?`}
  onConfirm={handleConfirmDelete}
  onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
/>
```

### Errores a Evitar
- ✅ NO usar `confirm()` nativo del navegador
- ✅ SIEMPRE usar `DeleteConfirmDialog` para eliminaciones
- ✅ Incluir nombre del item en el mensaje
- ✅ Usar `isLoading` para mostrar estado de carga
