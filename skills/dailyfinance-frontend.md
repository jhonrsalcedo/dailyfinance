# skill: dailyfinance-frontend.md
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
├── schemas/      # Schemas Zod
├── theme/        # Tema MUI
└── utils/        # Utilidades (currency)
```

## Documentación
- Patrones en LEARN_NextJS.md