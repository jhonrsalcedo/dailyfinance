# 🤖 ROLES.md - Daily Finance App

## 🎯 Objetivo del Proyecto
- **Stack:** Next.js 15 + MUI v5 + React Hook Form + Zod + FastAPI
- **DB:** SQLite (desarrollo) / PostgreSQL (producción)
- **Hardware:** MacBook Air M3 (8GB RAM)
- **REGLA DE ORO:** Código limpio. Documentación en LEARN_*.md.

---

## 📋 DOCUMENTACIÓN DEL PROYECTO

| Documento | Propósito |
|-----------|-----------|
| `DEVELOPMENT_GUIDE.md` | Guía de desarrollo con reglas |
| `PRE_DEVELOPMENT_CHECKLIST.md` | Checklist antes de empezar |
| `skills/*.md` | Skills personalizadas |
| `LEARN_*.md` | Decisiones técnicas |
| `README.md` | Instrucciones de uso |

---

## 🟢 FRONTEND ARCHITECT (MUI Specialist)

### Stack
- Next.js 15 (App Router)
- MUI v5 (@mui/material)
- React Hook Form
- Zod (validación)
- Recharts (gráficos)

### Reglas
- Sin punto y coma
- Comillas simples
- Componentes máximo 150 líneas
- Sin comentarios en código

---

## 🔵 BACKEND ENGINEER (FastAPI Specialist)

### Stack
- FastAPI
- SQLModel (ORM)
- Pydantic
- SQLite

### Reglas
- Código limpio, sin comentarios excesivos
- Type hints estrictos
- Máximo 50 líneas por endpoint

---

## ⚠️ PROCESO: Plan Mode vs Construcción

### Plan Mode (Solo Lectura)
- ✅ Leer y analizar
- ✅ Proponer planes
- ❌ NO editar ni ejecutar

### Construcción (Ejecución)
- ✅ Crear/editar archivos
- ✅ Ejecutar comandos
- ✅ Verificar funciona

### Para cambiar de modo
- Usuario dice: **"si"** o **"procede"** o **"ejecutar"**
- Ejecutar **inmediatamente** sin esperar más confirmación

---

## 🧠 PROTOCOLO DE MEMORIA (Engram)

1. **ANTES:** `mem_search` para buscar contexto previo
2. **DURANTE:** `mem_save` después de decisiones técnicas
3. **DESPUÉS:** `mem_session_summary` al cerrar sesión

---

## ✅ DEFINITION OF DONE (DoD)

- Código compila sin errores
- Funcionalidad implementada
- Documentación actualizada
- Git commit realizado

---

## 📚 READ FIRST

Antes de empezar cualquier desarrollo:
1. Leer `DEVELOPMENT_GUIDE.md`
2. Completar `PRE_DEVELOPMENT_CHECKLIST.md`
3. Definir stack y modelo de datos
