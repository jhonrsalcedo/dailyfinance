# Checklist de Desarrollo

Rutina obligatoria antes de cada commit y deploy.

---

## Antes de cada Commit

```bash
# 1. Verificar que el código compila
npm run typecheck    # Frontend
make typecheck     # Backend

# 2. Verificar lint
npm run lint       # Frontend
make lint         # Backend (si existe)

# 3. Verificar tests
npm run test      # Frontend
make test        # Backend
```

### Checklist Visual

- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] `npm run test` pasa (si hay tests)
- [ ] Funcionalidad probada manualmente
- [ ] No hay hardcoded data (usar API)
- [ ] Types definidos correctamente
- [ ] Mensaje de commit claro

---

## Agregar un Nuevo Feature

### 1. Planificar

- [ ] Definir historia de usuario
- [ ] Definir endpoints de API necesarios
- [ ] Definir componentes de UI necesarios

### 2. Backend

- [ ] Crear modelo en `database.py` (si es nueva tabla)
- [ ] Crear ruta en `app/routes/`
- [ ] Agregar router en `main.py`
- [ ] Probar endpoint con curl o Swagger docs

### 3. Frontend

- [ ] Crear página/componente
- [ ] Usar React Query para fetch
- [ ] Conectar con API
- [ ] TypeScript sin errores

### 4. Documentar

- [ ] Actualizar CHANGELOG.md
- [ ] Documentar en LEARN si es concepto nuevo

### 5. Commit

- [ ] git add .
- [ ] git commit -m "feat: descripción"
- [ ] Verificar pre-commit hook pasa

---

## Pre-Deploy Checklist

### Configuración

- [ ] Variables de entorno en `.env` (no commitear)
- [ ] `.env.example` actualizado
- [ ] CORS configurado para producción

### Build

- [ ] `npm run build` pasa sin errores
- [ ] `make build` pasa sin errores (backend)
- [ ] typecheck pasa
- [ ] lint pasa

### Base de Datos

- [ ] Schema actualizado
- [ ] Seed data si es necesario
- [ ] Migraciones si son necesarias

### Testing

- [ ] Tests pasan
- [ ] Coverage adecuado (>70%)

### Seguridad

- [ ] No exposure de secrets
- [ ] Errores controlados
- [ ] CORS solo producción
- [ ] Input validation

---

## Comandos Útiles

### Frontend
```bash
cd frontend
npm run dev          # Desarrollo
npm run build       # Producción
npm run typecheck   # Verificar TS
npm run lint        # Lint
npm run test       # Tests
```

### Backend
```bash
cd backend
make run          # Desarrollo
make install      # Instalar dependencias
make test         # Tests
make typecheck    # Verificar Python
```

---

## Tips de Buenas Prácticas

1. **No hardcodear datos** - Siempre usar API/DB
2. **Types estrictos** - Evitar `any`
3. **Una cosa por archivo** - Mantener simple
4. **Commits pequeños** - Más fácil de revisar
5. **Probar antes de commit** - Evitar errores enCI
6. **Documentar decisiones** - En CHANGELOG o LEARN