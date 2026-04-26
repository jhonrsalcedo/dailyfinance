'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Box, Toolbar } from '@mui/material'
import { createAppTheme } from '@/theme/theme'
import { Sidebar, DRAWER_WIDTH } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { AuthProvider } from '@/contexts/AuthContext'
import { OnboardingChecker } from '@/components/OnboardingChecker'

const queryClient = new QueryClient()

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null
    if (savedMode) {
      setMode(savedMode)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark')
    }
  }, [])

  const theme = useMemo(() => createAppTheme(mode), [mode])

  const toggleTheme = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('themeMode', newMode)
  }, [mode])

  const handleMobileMenuToggle = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false)
  }, [])

  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider theme={createAppTheme('light')}>
          <CssBaseline />
        </MuiThemeProvider>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OnboardingChecker />
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <TopBar
              onMobileMenuClick={handleMobileMenuToggle}
              onThemeToggle={toggleTheme}
              themeMode={mode}
            />
            <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                ml: { md: `${DRAWER_WIDTH}px` },
                minHeight: '100vh',
                bgcolor: 'background.default',
                pt: { xs: 2, md: 3 },
                px: { xs: 2, md: 3 },
                transition: 'padding 0.3s ease',
              }}
            >
              <Toolbar />
              {children}
            </Box>
          </Box>
        </MuiThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}