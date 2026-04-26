'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LoginIcon from '@mui/icons-material/Login'
import LanguageIcon from '@mui/icons-material/Language'
import { DRAWER_WIDTH } from './Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/utils/i18n'

interface TopBarProps {
  onMobileMenuClick: () => void
  onThemeToggle?: () => void
  themeMode?: 'light' | 'dark'
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const locale = localStorage.getItem('language') === 'en' ? 'en-US' : 'es-CO'
  return date.toLocaleDateString(locale, options)
}

function getGreeting(): string {
  const hour = new Date().getHours()
  const lang = localStorage.getItem('language') || 'es'
  if (hour < 12) return lang === 'en' ? 'Good morning' : 'Buenos días'
  if (hour < 18) return lang === 'en' ? 'Good afternoon' : 'Buenas tardes'
  return lang === 'en' ? 'Good evening' : 'Buenas noches'
}

export function TopBar({ onMobileMenuClick, onThemeToggle, themeMode = 'light' }: TopBarProps) {
  const theme = useTheme()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const { t, language, changeLanguage } = useTranslation()
  const [currentDate, setCurrentDate] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    setCurrentDate(formatDate(new Date()))
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSettingsClick = () => {
    handleMenuClose()
    router.push('/settings')
  }

  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
    router.push('/')
  }

  const handleLanguageToggle = () => {
    changeLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMobileMenuClick}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {getGreeting()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {currentDate}
            </Typography>
          </Box>

          <Tooltip title={language === 'es' ? 'Cambiar a inglés' : 'Switch to English'}>
            <IconButton
              onClick={handleLanguageToggle}
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              }}
            >
              <LanguageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            </IconButton>
          </Tooltip>

          {onThemeToggle && (
            <IconButton
              onClick={onThemeToggle}
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              }}
            >
              {themeMode === 'light' ? (
                <DarkModeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              ) : (
                <LightModeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              )}
            </IconButton>
          )}

          {!isAuthenticated ? (
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
              sx={{ borderRadius: 2 }}
            >
              {t('auth.login')}
            </Button>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.username || 'Usuario'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleSettingsClick}>
                  <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2">{t('nav.settings')}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: 'error.main' }} />
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    {t('auth.logout')}
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}