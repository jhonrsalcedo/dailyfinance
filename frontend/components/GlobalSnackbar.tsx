'use client'

import { Snackbar, Alert } from '@mui/material'
import { useSnackbar } from '@/hooks/useSnackbar'

export function GlobalSnackbar() {
  const { open, message, severity, hide } = useSnackbar()

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={hide}
      autoHideDuration={4000}
      sx={{ mb: { xs: 8, md: 3 } }}
    >
      <Alert
        onClose={hide}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}