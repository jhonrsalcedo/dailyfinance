'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { OnboardingModal } from '@/components/OnboardingModal'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export function OnboardingChecker() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const { data: onboardingStatus } = useQuery<{ onboarding_completed: boolean }>({
    queryKey: ['onboardingStatus'],
    queryFn: async () => {
      const token = (session as any)?.accessToken
      const { data } = await axios.get(`${API_BASE_URL}/settings/onboarding-status`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      return data
    },
    enabled: isAuthenticated && !!session,
    retry: 1,
  })

  useEffect(() => {
    if (!isLoading && isAuthenticated && onboardingStatus && !onboardingStatus.onboarding_completed) {
      const hasSeenOnboarding = localStorage.getItem('onboarding_shown')
      if (!hasSeenOnboarding) {
        setOpen(true)
        localStorage.setItem('onboarding_shown', 'true')
      }
    }
  }, [isLoading, isAuthenticated, onboardingStatus])

  if (!isAuthenticated || isLoading || !onboardingStatus) {
    return null
  }

  return <OnboardingModal open={open} onClose={() => setOpen(false)} />
}