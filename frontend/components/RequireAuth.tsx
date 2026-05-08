'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CircularProgress, Box } from '@mui/material'

interface RequireAuthProps {
  children: React.ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return <>{children}</>
}