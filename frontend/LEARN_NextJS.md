# LEARN_NextJS.md
# Patrones y Decisiones Frontend (Next.js 15 + shadcn/ui)

## 1. Comandos de Ejecución

```bash
cd frontend
make install   # npm install
make dev       # npm run dev (http://localhost:3000)
make build     # npm run build
```

## 2. Gestión de Estado

- **React Query:** Fetcheo de datos del backend
- **Axios:** Llamadas HTTP
- **API_BASE_URL:** `http://localhost:8000/api/v1`

## 3. Componentes UI (shadcn/ui)

- Instalados en `components/ui/` (Card, Button, Input, Select, Textarea)
- Alias configurado en `tsconfig.json`: `@/*` → `./`
- Configuración en `components.json`

## 4. Dashboard

- `page.tsx`: consume `/transactions/stats`
- `TransactionForm.tsx`: POST a `/transactions`
- `CategoryChart.tsx`: Gráfico de pastel (Recharts)
- `MonthlyTrend.tsx`: Gráfico de línea (Recharts)
