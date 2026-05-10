'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

interface SnackbarContextType {
  open: boolean
  message: string
  severity: SnackbarSeverity
  show: (message: string, severity?: SnackbarSeverity) => void
  hide: () => void
}

const SnackbarContext = createContext<SnackbarContextType>({
  open: false,
  message: '',
  severity: 'success',
  show: () => {},
  hide: () => {},
})

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    open: false,
    message: '',
    severity: 'success' as SnackbarSeverity,
  })

  const show = useCallback((message: string, severity: SnackbarSeverity = 'success') => {
    setState({ open: true, message, severity })
  }, [])

  const hide = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  return (
    <SnackbarContext.Provider value={{ ...state, show, hide }}>
      {children}
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  return useContext(SnackbarContext)
}