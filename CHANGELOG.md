# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

---

## [1.3.0] - 2026-08-24

### Agregado
- UX: Formateo de moneda en vivo en inputs (`$ 5.700.000` mientras se escribe) con nuevo componente `CurrencyInput` (react-number-format)
- UX: `inputMode="numeric"` en inputs de moneda (teclado numérico en móvil)
- Test: 5 tests unitarios de CurrencyInput (formateo, vaciado, negativos, accesibilidad)
- Docs: Workflow de releases por lotes (develop → main) en AGENTS, skills, guías y checklists

### Integrado en
- TransactionForm (monto, crear + editar)
- Settings tab Pagos (salario) y UserProfile tab Perfil (salario)
- Budget dialog (límite)
- OnboardingModal (salario inicial)

### Corregido
- Settings: render de `0` crudo en "Último salario guardado" cuando salary era 0 (gotcha de React con falsy)

---

## [1.0.0] - 2026-05-09

### Agregado
- Security: Rate limiting (slowapi) para /login y /register
- Security: CORS restrictivo (solo GET, POST, PUT, DELETE)
- Security: Logging de auditoría para intentos de login
- Auth: Middleware proteje /reports y /budget
- Auth: Sidebar con requiresAuth para reports
- Docs: Guía de dependencias en LEARN_CICD.md
- Docs: Patrón de secciones protegidas en LEARN_NextJS.md
- Docs: Reglas de código limpio

### Corregido
- Reports ahora require auth (protegido con middleware + sidebar)
- Budget ahora require auth
- Código limpio: API_BASE_URL consolidado en utils/api.ts
- Imports duplicados removidos en transactions.py
- Login button redundante removido del dashboard

### Cambios
- Migración a producción lista

---

## [0.1.0] - 2026-04-22

### Agregado
- Budget API: CRUD completo con cálculo automático de gastado desde transacciones
- Stats API: 3 endpoints (monthly, by-category, history)
- Budget Frontend: CRUD con selector de mes, progress bars por categoría
- Reports Frontend: Gráficos conectados a API real

### Corregido
- Categories ahora se cargan desde API en lugar de hardcoded
- Payment methods conectados a API
- RecentTransactions, transactions page, y settings page ahora usan datos reales

---

## [0.1.0] - 2026-04-22

### Agregado
- Dashboard con balance en tiempo real
- Módulo de Transacciones: CRUD completo
- Módulo de Categorías: CRUD completo
- Módulo de Métodos de Pago: CRUD completo
- Módulo de Salario: Guards desde DB
- Módulo de Presupuesto (UI básica, sin API)
- Módulo de Reportes (UI básica, sin API)
- Sidebar con navegación
- Estilo corporativo/MUI
- Tema profesional

### 技术栈
- Frontend: Next.js 15 + MUI v5 + React Query
- Backend: FastAPI + SQLModel + SQLite
- Testing: Vitest + Pytest
- CI/CD: GitHub Actions + Husky