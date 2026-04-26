'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/utils/auth'
import { User } from '@/models'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      if (authApi.isAuthenticated()) {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch {
      authApi.logout()
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const login = async (email: string, password: string) => {
    await authApi.login(email, password)
    await checkAuth()
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  useEffect(() => {
    checkAuth().finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}