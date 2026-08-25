# Development Guide - Estándar de Desarrollo

## 1. ANTES DE EMPEZAR (Pre-Desarrollo)

### 1.1 Configurar Entorno
- [ ] Python 3.11+ instalado (`python --version`)
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Git inicializado (`git init`)
- [ ] Editor configurado (VS Code, Cursor, etc.)

### 1.2 Definir Stack (antes de escribir código)
- [ ] Elegir UI Framework
  - **Recomendado: MUI v5** - Rápido, componentes listos
  - Alternativa: Tailwind + shadcn/ui - Más flexible
- [ ] Elegir Form Library
  - **Recomendado: React Hook Form + Zod**
- [ ] Elegir DB
  - **Recomendado: SQLite** (desarrollo) → PostgreSQL (producción)

### 1.3 Plan de Migración (si cambia de tecnología)
1. Instalar nuevas dependencias
2. Crear componentes básicos
3. Migrar funcionalidad paso a paso
4. Eliminar viejo código
5. Testear completamente

---

## 2. DURANTE EL DESARROLLO

### 2.1 Reglas de Código
- Sin punto y coma (TypeScript/Python)
- Comillas simples
- Máximo 100-150 líneas por componente
- No comentarios en código (documentar en LEARN_*.md)
- Type hints estrictos (Python)
- TypeScript strict mode

### 2.2 Antes de hacer commit
- [ ] Código compila sin errores
- [ ] Tests pasan (si existen)
- [ ] No hay console.log de debug
- [ ] Variables de entorno en .env (no subir)

### 2.3 Después de cada fase
- [ ] Guardar en Engram con mem_save
- [ ] Actualizar LEARN_*.md

---

## 3. COMUNICACIÓN: Plan Mode vs Construcción

### Plan Mode (Solo Lectura)
- ✅ Leer archivos
- ✅ Analizar código
- ✅ Proponer planes
- ❌ NO editar archivos
- ❌ NO crear archivos
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

## 4. STACK RECOMENDADO

### Frontend
| Opción | Pros | Contras |
|--------|------|---------|
| **MUI v5** | Rápido, componentes listos | Theming inicial |
| Tailwind + shadcn/ui | Flexible | Más configuración |

### Formularios
- **React Hook Form + Zod** (estándar recomendado)

### Base de Datos
- **SQLite** (desarrollo)
- **PostgreSQL** (producción)

### Backend
- **FastAPI** + SQLModel + Pydantic

---

## 5. VERIFICACIÓN DE FUNCIONALIDAD

### Backend
```bash
# Verificar corre
curl http://localhost:8000/

# Verificar endpoint
curl http://localhost:8000/api/v1/categories

# Verificar DB
sqlite3 db/dailyfinance.db "SELECT * FROM categories;"
```

### Frontend
```bash
# Instalar dependencias
npm install

# Correr desarrollo
npm run dev

# Verificar en navegador
# http://localhost:3000
```

---

## 6. GIT WORKFLOW

### Antes de empezar
```bash
git init
# Crear .gitignore
# Crear README.md
git add .
git commit -m "Initial commit"
```

### Durante desarrollo
```bash
git add .
git status
git commit -m "feat: descripción"
```

### Cuando esté listo para GitHub
```bash
git remote add origin https://github.com/USUARIO/REPO.git
git branch -M main
git push -u origin main
```

### Archivos que NO se suben
```
node_modules/
.venv/
*.db
.env
.next/
__pycache__/
```

---

## 7. GIT WORKFLOW CON CHECKS AUTOMATIZADOS

### Setup Inicial (nuevo proyecto)
```bash
# 1. Clonar o inicializar repo
git init

# 2. Instalar dependencias de desarrollo
npm install -D husky lint-staged

# 3. Inicializar Husky
npx husky init
```

### Flujo de Commit
```bash
# 1. Haz cambios en el código
vim frontend/app/page.tsx

# 2. Stagea los archivos
git add .

# 3. Commit → Se ejecuta pre-commit automáticamente
git commit -m "feat: nueva funcionalidad"
#       ↓
#  [HUSKY] Ejecuta lint-staged
#       ↓
#  Si pasa → Commit creado ✓
#  Si falla → Muestra errores → Corrige y vuelve a intentar
```

### Hooks Locales Configurados
| Hook | Qué hace | Si falla |
|------|----------|----------|
| `pre-commit` | `npm run lint` + `npm run typecheck` | Bloquea commit |

### CI/CD en GitHub (con cada push)
Se ejecuta automáticamente en GitHub Actions:

```yaml
# Jobs:
1. lint-and-typecheck  # ESLint + TypeScript
2. build              # Next.js build (depende de anterior)
3. backend-checks     # Verificación de backend
```

### Configuración de Archivos
```
├── .husky/
│   └── pre-commit          # Hook local
├── lint-staged.config.js   # Config de linting
└── .github/workflows/
    └── checks.yml          # Pipeline CI/CD
```

### Flujo de Release (develop → main)

`main` es producción y se actualiza por **releases por lotes**, no después de cada cambio:

```bash
# 1. Acumular features/fixes en develop (validados: lint + typecheck + tests + visual)

# 2. Preparar versión (en develop)
#    - frontend/config/version.ts: bump APP_VERSION
#    - CHANGELOG.md: mover [Sin liberar] a [vX.Y.Z] - fecha
git commit -am "release: vX.Y.Z"

# 3. Merge a producción (confirmar con el equipo/usuario antes)
git checkout main
git pull origin main
git merge develop
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin main --tags

# 4. Volver a develop
git checkout develop
```

**Reglas**:
- Cada merge a main = una versión liberada (tag + CHANGELOG)
- Hotfix urgente: fix directo en main + backport a develop
- Ver también: `AGENTS.md` sección "Releases por Lotes"

---

## 8. ESTRUCTURA DE PROYECTO ESTÁNDAR

```
proyecto/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── database.py
│   ├── main.py
│   ├── requirements.txt
│   ├── Makefile
│   └── LEARN_*.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── schemas/
│   ├── theme/
│   ├── utils/
│   ├── package.json
│   ├── Makefile
│   └── LEARN_*.md
├── db/
│   ├── schema.sql
│   ├── seed.sql
│   └── LEARN_*.md
├── docker/
├── skills/
├── README.md
├── ROLES.md
└── .gitignore
```

---

## 9. DEBUGGING COMÚN

### Error: "Cannot find module"
- Verificar que las dependencias están instaladas
- Verificar path de imports

### Error: "Connection refused"
- Verificar que el servidor está corriendo
- Verificar puerto correcto

### Error: "CORS policy"
- Agregar middleware CORS en backend
- Verificar allow_origins incluye localhost

### Error: "undefined"
- Verificar exports/imports
- Verificar que el componente existe

---

## 10. OPTIMIZACIÓN DE TOKENS

### Código Limpio
- No comentarios innecesarios
- No código commented-out
- Funciones pequeñas (máx 50-100 líneas)

### Documentación Separada
- LEARN_*.md para explicar decisiones
- Skills para reglas de desarrollo
- README.md para instrucciones

### Communicación
- Respuestas concisas
- Si/No cuando sea posible
- Evitar explicaciones innecesarias
