# AUDIT REPORT — Recorrido Completo con Chrome DevTools MCP

**Fecha**: 2026-08-22 | **Entorno**: Local dev (SQLite + FastAPI :8000 + Next.js :3000)
**Método**: Chrome DevTools MCP — snapshots a11y, network, consola, performance trace, Lighthouse
**Cuenta de prueba**: audit.devtools@yopmail.com (creada durante la auditoría)

---

## Resumen Ejecutivo

| Área | Resultado |
|------|-----------|
| Funcionalidad end-to-end | ✅ 100% operativa |
| Consola JS (todas las pages) | ✅ 0 errores |
| Lighthouse Best Practices | ✅ 100 |
| Lighthouse Accessibility | ⚠️ 84 |
| Lighthouse SEO | ⚠️ 80 (sin `<title>` ni meta description) |
| CLS | ✅ 0.00 |
| Aislamiento de datos multi-usuario | 🚨 CRÍTICO: transacciones y presupuestos NO están aislados por usuario |

---

## 🚨 Hallazgo Crítico: Sin aislamiento de datos por usuario

La tabla `transaction` **no tiene columna `user_id`**. Tampoco `monthlybudget`. Solo `usersettings` tiene `user_id`.

```sql
CREATE TABLE "transaction" (
  id INTEGER NOT NULL,
  amount FLOAT NOT NULL,
  date VARCHAR NOT NULL,
  description VARCHAR,
  category_id INTEGER,
  method_id INTEGER,
  -- ❌ NO HAY user_id
  FOREIGN KEY(category_id) REFERENCES category (id),
  FOREIGN KEY(method_id) REFERENCES paymentmethod (id)
);
```

**Evidencia**: usuario recién creado (`audit.devtools@yopmail.com`, id=5) vio inmediatamente las 5 transacciones sembradas de otros usuarios (mayo 2026). Igual con budgets (ids 1-4 de otros usuarios visibles).

**Impacto en producción (Turso)**: cualquier usuario registrado ve y puede borrar las finanzas de todos los demás. Es el bug #1 a corregir.

**Fix requerido**:
1. Migración: agregar `user_id` a `transaction` y `monthlybudget` con FK a `user`
2. Backend: filtrar queries por `current_user.id` en todos los endpoints
3. Frontend: sin cambios (el token ya viaja en cada request)

---

## ✅ Flujos Verificados OK

### Fase 1 — Backend ↔ BD
- SQLite en `db/dailyfinance.db` con tablas: user, category, transaction, monthlybudget, usersettings, paymentmethod
- 10 categorías y métodos de pago sembrados correctamente
- Endpoints `/stats/monthly`, `/stats/by-category`, `/stats/history` filtran bien por mes (verificado por curl)

### Fase 2 — Dashboard Demo
- Modo demo renderiza datos de ejemplo **sin llamar al backend** (solo `/api/auth/session`) → confirma fix del guard `status !== 'authenticated'`
- Sidebar deshabilita secciones protegidas para visitantes ✓

### Fase 3 — Auth
- Registro → auto-login → redirect a dashboard ✓
- Flujo NextAuth: `register [200]` → `callback/credentials` → sesión JWT con accessToken ✓
- Logout desde menú del avatar → regresa a modo demo ✓

### Fase 4 — Transacciones CRUD
| Test | Resultado |
|------|-----------|
| Submit vacío | ✅ Zod: "El monto es requerido", "Selecciona una categoría", "Selecciona un método" |
| Monto negativo | ✅ "El monto debe ser mayor a 0" |
| Crear válida ($150.000) | ✅ POST 200, form reseteado, stats reactivos, gráfico pie actualizado |
| Buscador ("Almuerzo") | ✅ filtra a 1 fila |
| Export CSV | ✅ `text/csv; charset=utf-8` con headers ID,Fecha,Monto,Descripción,Categoría,Método |
| DeleteConfirmDialog | ✅ aparece, Cancelar no elimina, Eliminar borra de BD |
| Totales página | ✅ $300.000 ingresos / $760.000 gastos = -$460.000 balance |

### Fase 5 — Settings (Salario)
- Set salario 5.700.000 → persistido en `usersettings.salary` con `user_id` correcto ✓
- Persistencia tras reload ✓
- Tabs Perfil/Categorías/Pagos presentes ✓

### Fase 6 — Budget
- Crear límite Alimentación $800.000 (agosto): gastado $150.000, restante $650.000, progreso **19%** ✓ matemática correcta
- Empty state correcto cuando no hay presupuestos del mes ✓

### Fase 7 — Reports
- Cards consistentes con stats API ✓
- Pie "Alimentación 100%" correcto para agosto ✓
- Gráficos Ingresos vs Gastos (6 meses) y Tendencia de Ahorro renderizan ✓
- Filtro de mes: cableado correcto (controlled input → queryKey refetch); backend devuelve datos distintos por mes verificado vía curl

### Fase 8 — Responsive
| Viewport | Layout |
|----------|--------|
| 375px móvil | ✅ hamburguesa + tarjetas |
| 820px tablet | ✅ tarjetas (estándar `down('md')` respetado) |
| 1440px desktop | ✅ tabla completa |

---

## 🐛 Bugs Menores

### 1. Off-by-one por timezone en fechas
Transacción creada con fecha `2026-08-22` se muestra como **"21 de ago"** en dashboard y **21/8/2026** en transactions.
- **Causa probable**: parseo de `YYYY-MM-DD` como UTC midnight → en UTC-5 retrocede un día
- **Fix sugerido**: parsear con `new Date(y, m-1, d)` o usar `date-fns` con `parseISO` + zona local

### 2. Botones de acción sin nombre accesible
Edit/delete en cada fila de transacciones no tienen `aria-label` (Lighthouse: `button-name` score 0).

### 3. Sin `<title>` ni meta description
Lighthouse SEO 80. Cada page debería setear título (ej: "Transacciones | Daily Finance").

### 4. Contraste de color insuficiente
`color-contrast` falló en elementos secundarios (texto gris sobre blanco).

### 5. Campo select sin label accesible
`aria-input-field-name`: el filtro Categoría usa TextField select sin `label`/`aria-label` visible.

### 6. Double roundtrip por trailing slash
El frontend llama `/api/v1/transactions` (307) → `/api/v1/transactions/` (200). Costo extra por request.
- **Fix**: llamar con slash final o normalizar rutas en `utils/api.ts`

---

## 📊 Performance

| Métrica | Valor | Nota |
|---------|-------|------|
| CLS | 0.00 | Excelente |
| LCP | ~1.7s | Dev mode infla el número (sin minify/optimizaciones); medir en prod |
| Forced reflow | Detectado menor | Asociado a render inicial |

---

## Datos de prueba dejados en BD local (según lo acordado)

- Usuario: audit.devtools@yopmail.com / Audit2026!
- usersettings: salary=5.700.000 COP
- Transacción id=8: "Almuerzo prueba auditoria" $150.000 (22/08)
- Budget id=5: Alimentación $800.000 (2026-08)

Screenshots: `/var/folders/.../T/opencode/02-dashboard-demo.jpeg`, `03-transactions-mobile.jpeg`

---

## Prioridad de Correcciones Sugerida

1. 🚨 **P0**: Agregar `user_id` a `transaction` y `monthlybudget` + filtrado en backend
2. 🐛 **P1**: Fix timezone off-by-one en display de fechas
3. ♿ **P1**: aria-labels en botones de acción + labels de selects
4. 🔍 **P2**: `<title>` + meta description por página
5. ⚡ **P3**: Normalizar trailing slash en llamadas API
