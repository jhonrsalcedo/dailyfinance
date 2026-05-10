# MUI v5 Responsive Design - Estándares del Proyecto

## Breakpoints Estándar

| Breakpoint | Ancho | Dispositivo |
|-----------|-------|-------------|
| xs | 0-599px | Móvil |
| sm | 600-899px | Móvil grande / Tablet pequeña |
| md | 900-1199px | Tablet |
| lg | 1200px+ | PC |

## Regla del Layout (Sidebar)

Todo componente que interactúe con el sidebar debe seguir esta estructura:

### ThemeRegistry/Componente Contenedor
```tsx
<Box sx={{ display: 'flex' }}>
  <Sidebar />  {/* permanent en md, temporary en xs */}
  <TopBar />   {/* fixed → ml en md */}
  <Box
    component="main"
    sx={{
      //PC: width reducido + margen para el sidebar
      width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
      ml: { md: `${DRAWER_WIDTH}px` },
      //Espacio para el TopBar fijo
      pt: { xs: 8, md: 9 },  // O usar <Toolbar />
    }}
  >
    <Toolbar />{/* Para spacing correcto */}
    {children}
  </Box>
</Box>
```

### TopBar/AppBar
```tsx
<AppBar
  position="fixed"
  sx={{
    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
    ml: { md: `${DRAWER_WIDTH}px` },
  }}
>
```

### Sidebar (Drawer)
```tsx
// Móvil: SwipeableDrawer temporary
<SwipeableDrawer
  variant="temporary"
  sx={{ display: { xs: 'block', md: 'none' } }}
/>

// PC: Drawer permanent
<Drawer
  variant="permanent"
  sx={{ display: { xs: 'none', md: 'block' } }}
/>
```

## Patrones Comunes por Componente

### Tablas → Cards (Móvil)
```tsx
// Mostrar como tabla en PC, como cards en móvil
<Box
  sx={{
    display: { xs: 'block', md: 'table' },
    '& > *': { display: { xs: 'block', md: 'table-row' } },
  }}
>
  {items.map(item => (
    <Card sx={{ display: { xs: 'block', md: 'table-cell' } }}>
    </Card>
  ))}
</Box>
```

### Botones
```tsx
<Button
  fullWidth={{ xs: true, sm: false }}
  size={{ xs: 'small', md: 'medium' }}
>
```

### Formularios
```tsx
<Stack spacing={2}>
  <TextField fullWidth />
  {/* Grid en PC, stack en móvil */}
  <Box sx={{ display: 'flex', gap: 2 }}>
    <TextField sx={{ flex: 1 }} />
    <TextField sx={{ flex: 1 }} />
  </Box>
</Stack>
```

### Texto
```tsx
<Typography
  variant={{ xs: 'h6', md: 'h4' }}
  textAlign={{ xs: 'center', md: 'left' }}
>
```

## Valores de DRAWER_WIDTH

```tsx
// Estándar del proyecto
export const DRAWER_WIDTH = 240
```

## Checklist de Responsive

- [ ] TopBar fijo tiene `ml:{md}` correcto
- [ ] Main tiene `width:{md}` y `ml:{md}` correctos
- [ ] Sidebar es `temporary` en xs, `permanent` en md
- [ ] <Toolbar /> después del TopBar fijo
- [ ] Tables muestran como cards en xs
- [ ] Botones visibles en móvil
- [ ] No hay overflow horizontal

## Errores Comunes

### Contenido detrás del Sidebar
**Problema**: Falta `ml` en el contenido principal.
```tsx
// ❌ Incorrecto
sx={{ width: { md: `calc(100% - ${W}px)` } }

// ✅ Correcto
sx={{
  width: { md: `calc(100% - ${W}px)` },
  ml: { md: `${W}px` },
}}
```

### TopBar cubre el contenido
**Problema**: No hay Toolbar o padding-top.
```tsx
// ❌ Falta espacio
<Box component="main">{children}</Box>

// ✅ Con Toolbar
<Box component="main">
  <Toolbar />
  {children}
</Box>
```

### Sidebar no se cierra en móvil
**Problema**: Falta onClose o variant incorrecto.
```tsx
// ❌
<Drawer variant="permanent" />

// ✅ Móvil + PC
<SwipeableDrawer variant="temporary" />
<Drawer variant="permanent" />
```

### Tabla desaparece en tablet (iPad Air)
**Problema**: Breakpoint incorrecto + isMobile no cubre tablet.

**Regla Estándar**:
| Elemento | Breakpoint | Descripción |
|----------|-----------|-------------|
| Tabla | `md: 'block'` (900px+) | Muestra tabla en tablets landscape + desktop |
| isMobile | `down('md')` | Cards en móvil (0-899px) |

```tsx
// ❌ INCORRECTO
const isMobile = useMediaQuery(theme.breakpoints.down('sm'))  // solo 0-599px
sx={{ display: { xs: 'none', lg: 'block' } }}  // tabla solo en 1200px+

// ✅ CORRECTO
const isMobile = useMediaQuery(theme.breakpoints.down('md'))  // 0-899px = móvil + tablet
sx={{ display: { xs: 'none', md: 'block' } }}  // tabla en 900px+ (tablet landscape + desktop)
```

## Hook useDeviceType (Recomendado)

Para detección más precisa:

```tsx
// hooks/useDeviceType.ts
import { useTheme, useMediaQuery } from '@mui/material'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDeviceType() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  return { isMobile, isTablet, isDesktop }
}

// Uso
const { isMobile, isTablet } = useDeviceType()

{isMobile ? <Cards /> : <Table />}
```

## Cobertura de Dispositivos

| Breakpoint | Rango | Dispositivo | Tabla | Cards |
|-----------|-------|------------|-------|-------|
| xs | 0-599px | Teléfono | ❌ | ✅ isMobile |
| sm | 600-899px | iPad mini, tablet | ❌ | ✅ isMobile |
| md | 900-1199px | **iPad Air** | ✅ | ❌ |
| lg | 1200px+ | Laptop/Desktop | ✅ | ❌ |