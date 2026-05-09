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
