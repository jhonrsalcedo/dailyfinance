import { useTheme, useMediaQuery } from '@mui/material'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  deviceType: DeviceType
}

export function useDeviceType(): DeviceInfo {
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  let deviceType: DeviceType = 'desktop'
  if (isMobile) deviceType = 'mobile'
  else if (isTablet) deviceType = 'tablet'

  return { isMobile, isTablet, isDesktop, deviceType }
}