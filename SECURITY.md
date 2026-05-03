# Security Guidelines - Daily Finance App

## ⚠️ Regla de Oro

**NUNCA colocar datos sensibles en código, documentación o ejemplos.**

Los archivos de este proyecto son **públicos en GitHub**. Cualquiera puede verlos.

---

## ¿Qué Datos SON Sensibles?

| Tipo | Ejemplos | Qué Hacer |
|------|---------|-----------|
| 🔑 **Contraseñas** | `password`, `secret`, `token` | Usar variables de entorno, nunca hardcodear |
| 🔗 **URLs de DB** | PostgreSQL, Neon, Turso | Usar `${DATABASE_URL}` o placeholders |
| 🔐 **API Keys** | `API_KEY`, `JWT_SECRET` | Generar, guardar en sistema, no en código |
| 📧 **Credenciales** | `username:password` | Nunca exponer |

---

## Placeholders正确os

### ❌ Incorrecto (Expuestas datos reales)
```markdown
DATABASE_URL=postgresql://neondb_owner:npg_xxxPassword@host.neon.tech/dbname
JWT_SECRET=15fc6101aa6e1d26a203d841a71abfdd2d7e84716ac41b9c0a660cb77c09c136
```

### ✅ Correcto (Placeholders)
```markdown
DATABASE_URL=postgresql://neondb_owner:<password>@ep-xxx.neon.tech/neondb?sslmode=require
JWT_SECRET=<generar: python -c "import secrets; print(secrets.token_hex(32))">
```

---

## Proceso Seguro Antes de Commit

### Checklist

- [ ] **No hay URLs de bases de datos** completas en código
- [ ] **No hay contraseñas** hardcodeadas
- [ ] **No hay tokens de API** visibles
- [ ] **Usar `.env`** para datos locales (no commiteado)
- [ ] **Verificar con `git diff`** antes de hacer push

### Verificar ANTES de Pushear

```bash
# Ver cambios pendientes
git diff

# Buscar datos sensibles
grep -r "password\|token\|secret\|postgres" --include="*.md" --include="*.py" --include="*.ts" .
```

---

## Cómo Documentar sin Exponer Datos

### En .env.example
```
# ❌ INCORRECTO
DATABASE_URL=postgresql://user:pass@host/db

# ✅ CORRECTO
DATABASE_URL=postgresql://user:<password>@host/db
```

### En README/Guías
```
# ❌ INCORRECTO
Deploy con: postgresql://neondb_owner:npg_password@...

# ✅ CORRECTO  
Deploy con tu URL de Neon: postgresql://neondb_owner:<password>@host.neon.tech/...
```

---

## Generar Secretos Seguros

### JWT SECRET (Backend)
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### NEXTAUTH SECRET (Frontend)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Dónde Guardar Datos Seguros

| Entorno | Dónde | Accesible por |
|--------|-------|--------------|
| **Desarrollo** | `.env` local | Solo tú (no commiteado) |
| **Producción** | Dashboard (Render/Vercel) | Solo tú |
| **Secrets** | Password manager | Solo tú |

**NUNCA** agregar `.env` al repo. Ya está en `.gitignore`.

---

## Si Expones DatosPorError

1. **Cambiar inmediatamente** la contraseña/token
2. **Revocar** credenciales antiguas
3. **Verificar** que no esté en commits anteriores
4. Usar BFG para limpiar historial si es necesario:
   ```bash
   bfg --replace-text --replace-passwords
   git push --force --all
   ```

---

## Resumen

| ✅ Hacer | ❌ No Hacer |
|----------|-------------|
| Usar `.env` local | Escribir passwords en código |
| Usar placeholders `<password>` | Exponer URLs reales |
| Generar secrets con scripts | Compartir credenciales |
| Verificar antes de push | Commit datos sensibles |