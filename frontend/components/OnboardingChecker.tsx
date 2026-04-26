'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { OnboardingModal } from '@/components/OnboardingModal'
import { useAuth } from '@/contexts/AuthContext'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export function OnboardingChecker() {
  const { isAuthenticated, loading } = useAuth()
  const [open, setOpen] = useState(false)

  const { data: onboardingStatus } = useQuery<{ onboarding_completed: boolean }>({
    queryKey: ['onboardingStatus'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/settings/onboarding-status`)
      return data
    },
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (!loading && isAuthenticated && onboardingStatus && !onboardingStatus.onboarding_completed) {
      const hasSeenOnboarding = localStorage.getItem('onboarding_shown')
      if (!hasSeenOnboarding) {
        setOpen(true)
        localStorage.setItem('onboarding_shown', 'true')
      }
    }
  }, [loading, isAuthenticated, onboardingStatus])

  if (!isAuthenticated || loading || !onboardingStatus) {
    return null
  }

  return <OnboardingModal open={open} onClose={() => setOpen(false)} />
}