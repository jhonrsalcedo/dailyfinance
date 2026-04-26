'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  SwipeableDrawer,
  Zoom,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import BarChartIcon from '@mui/icons-material/BarChart'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'

export const DRAWER_WIDTH = 260

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: '/' },
  { label: 'Transacciones', icon: <ReceiptIcon />, href: '/transactions' },
  { label: 'Reportes', icon: <BarChartIcon />, href: '/reports' },
  { label: 'Presupuesto', icon: <AccountBalanceWalletIcon />, href: '/budget' },
  { label: 'Configuración', icon: <SettingsIcon />, href: '/settings' },
]

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px ' + alpha(theme.palette.primary.main, 0.3),
            }}
          >
            <AccountBalanceWalletIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '1rem',
                lineHeight: 1.2,
              }}
            >
              Daily Finance
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Gestión Personal
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={onMobileClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={onMobileClose}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          v1.0.0
        </Typography>
      </Box>
    </Box>
  )

  return (
    <>
      {isMobile ? (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          onOpen={() => {}}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              transition: 'transform 0.3s ease',
            },
          }}
        >
          <Zoom in={mobileOpen} timeout={300}>
            <Box>{drawerContent}</Box>
          </Zoom>
        </SwipeableDrawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              transition: 'width 0.3s ease',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  )
}