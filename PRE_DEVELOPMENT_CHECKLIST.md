# Pre-Development Checklist

## Configuración Inicial

### Entorno
- [ ] Python 3.11+ instalado (`python --version`)
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm o yarn instalado (`npm --version`)
- [ ] Git instalado (`git --version`)

### Repositorio
- [ ] Git inicializado (`git init`)
- [ ] .gitignore creado
- [ ] .env.example creado (plantilla de variables)
- [ ] README.md inicial
- [ ] ROLES.md con stack definido

### Documentación
- [ ] Skills creadas para el proyecto
- [ ] LEARN_*.md準備
- [ ] DEVELOPMENT_GUIDE.md leído

---

## Definición del Proyecto

### Requisitos Funcionales
- [ ] Funcionalidad core definida
- [ ] Categorías identificadas
- [ ] Métodos de pago identificados
- [ ] Formato de moneda decidido (COP, USD, etc.)
- [ ] Modelo de datos definido

### Modelo de Datos
- [ ] Entidades identificadas (Users, Transactions, etc.)
- [ ] Relaciones definidas (1:1, 1:N, N:N)
- [ ] Schema SQL escrito (schema.sql)
- [ ] Seed data preparado (seed.sql)

---

## Plan de Migración (Si cambia de tecnología)

### Antes de migrar
- [ ] Nueva tecnología elegida
- [ ] Dependencias identificadas
- [ ] Plan de migración escrito

### Durante migración
- [ ] Dependencias instaladas
- [ ] Componentes básicos creados
- [ ] Funcionalidad migrada paso a paso
- [ ] Viejo código eliminado
- [ ] Tests pasan

---

## Verificación Pre-Desarrollo

### Backend
- [ ] Python virtual environment creado
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Base de datos creada
- [ ] Seed data insertado
- [ ] Endpoints funcionan (curl test)

### Frontend
- [ ] Dependencias instaladas (`npm install`)
- [ ] UI Framework configurado
- [ ] Tema personalizado creado
- [ ] Componentes base creados

---

## Comunicación con IA

### Antes de empezar
- [ ] Haber leído DEVELOPMENT_GUIDE.md
- [ ] Haber creado/buscado skills personalizadas
- [ ] Plan definido (qué hacer, cómo hacerlo)

### Durante desarrollo
- [ ] Confirmar explícitamente "si, procede" o "ejecutar"
- [ ] Evitar entrar/salir de Plan Mode constantemente
- [ ] Dar feedback claro de errores

---

## Git Setup

### Inicialización
```bash
# 1. Crear directorio del proyecto
mkdir proyecto
cd proyecto

# 2. Git init
git init

# 3. Crear archivos base
touch README.md
touch .gitignore

# 4. Primer commit
git add .
git commit -m "Initial commit"
```

### Archivos .gitignore recomendados
```
# Python
__pycache__/
*.pyc
.venv/
.env

# Node
node_modules/
package-lock.json

# Database
*.db
*.sqlite

# Next.js
.next/

# IDE
.vscode/
.idea/

# macOS
.DS_Store
```

---

## Checklist Rápido (Resumen)

```
PRE-DESARROLLO:
□ Python/Node/Git instalados
□ Git init + .gitignore
□ Stack definido (UI + Forms + DB)
□ Modelo de datos definido
□ Schema SQL escrito

DESARROLLO:
□ Backend primero (DB + API)
□ Verificar con curl
□ Frontend después (UI + Forms)
□ Verificar en navegador

POST-DESARROLLO:
□ Tests pasan
□ No console.log de debug
□ Código limpio
□ Documentación actualizada
□ Git commit
```

---

## Errores Comunes a Evitar

| # | Error | Solución |
|---|-------|----------|
| 1 | shadcn/ui no funciona | Usar MUI en su lugar |
| 2 | Ruta DB incorrecta | Usar `Path(__file__).parent` |
| 3 | Foreign Keys mal | Usar formato `table.column` |
| 4 | Schema no acepta negativos | Usar `float` no `PositiveFloat` |
| 5 | Plan Mode se activa | Confirmar "si, procede" explícitamente |
| 6 | Dependencias faltantes | package.json completo |
