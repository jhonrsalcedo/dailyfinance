'use client'

import { signOut, signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return {
    user: session?.user ? {
      id: session.user.id as string,
      email: session.user.email as string,
      username: session.user.name as string,
    } : null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    login: async (email: string, password: string) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.ok) {
        router.push('/dashboard')
      }
      return result
    },
    logout: async () => {
      await signOut({ redirect: false })
      router.push('/login')
    },
  }
}