'use client'

import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingProps {
  size?: number
  message?: string
  fullScreen?: boolean
}

export function Loading({ size = 40, message = 'Cargando...', fullScreen = false }: LoadingProps) {
  const content = (
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  )

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        {content}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
      }}
    >
      {content}
    </Box>
  )
}