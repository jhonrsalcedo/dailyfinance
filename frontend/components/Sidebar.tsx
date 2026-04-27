'use client'

import { usePathname, useRouter } from 'next/navigation'
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
  Tooltip,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import BarChartIcon from '@mui/icons-material/BarChart'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import LoginIcon from '@mui/icons-material/Login'
import { useSession } from 'next-auth/react'
import { useTranslation } from '@/utils/i18n'

export const DRAWER_WIDTH = 260

const navItems: Array<{
  label: string
  labelKey: string
  icon: React.ReactNode
  href: string
  requiresAuth?: boolean
}> = [
  { label: 'Panel', labelKey: 'nav.dashboard', icon: <DashboardIcon />, href: '/' },
  { label: 'Transacciones', labelKey: 'nav.transactions', icon: <ReceiptIcon />, href: '/transactions', requiresAuth: true },
  { label: 'Reportes', labelKey: 'nav.reports', icon: <BarChartIcon />, href: '/reports' },
  { label: 'Presupuesto', labelKey: 'nav.budget', icon: <AccountBalanceWalletIcon />, href: '/budget', requiresAuth: true },
  { label: 'Configuración', labelKey: 'nav.settings', icon: <SettingsIcon />, href: '/settings', requiresAuth: true },
]

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { status } = useSession()
  const { t, language } = useTranslation()

  const isAuthenticated = status === 'authenticated'

  const getLabel = (labelKey: string): string => {
    if (language === 'en') {
      const enLabels: Record<string, string> = {
        'nav.dashboard': 'Dashboard',
        'nav.transactions': 'Transactions',
        'nav.reports': 'Reports',
        'nav.budget': 'Budget',
        'nav.settings': 'Settings',
      }
      return enLabels[labelKey] || labelKey
    }
    return t(labelKey)
  }

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.requiresAuth && !isAuthenticated) {
      router.push('/login')
      if (isMobile) onMobileClose()
      return
    }
    if (isMobile) onMobileClose()
  }

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
              {language === 'en' ? 'Personal Finance' : 'Gestión Personal'}
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
          const needsAuth = item.requiresAuth
          const isDisabled = needsAuth && !isAuthenticated

          return (
            <Tooltip
              key={item.href}
              title={isDisabled ? t('tooltip.loginRequired') : ''}
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={isDisabled ? '#' : item.href}
                  onClick={() => handleItemClick(item)}
                  disabled={isDisabled}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    color: isDisabled
                      ? alpha(theme.palette.text.primary, 0.38)
                      : isActive
                      ? 'primary.main'
                      : 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: isDisabled
                        ? alpha(theme.palette.primary.main, 0.04)
                        : isActive
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.primary.main, 0.04),
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isDisabled
                        ? alpha(theme.palette.text.primary, 0.38)
                        : isActive
                        ? 'primary.main'
                        : 'text.secondary',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {isDisabled && needsAuth ? <LoginIcon /> : item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={getLabel(item.labelKey)}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          )
        })}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
          {language === 'en' ? 'v1.0.0' : 'v1.0.0'}
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
          {drawerContent}
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