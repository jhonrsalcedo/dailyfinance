'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Avatar,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { UserSettings, ProfileUpdate, CURRENCIES } from '@/models'
import { Loading } from '@/components/Loading'
import api from '@/utils/api'
import { formatCurrency } from '@/utils/currency'

interface UserProfileProps {
  onSave?: () => void
}

export function UserProfile({ onSave }: UserProfileProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currency: 'COP',
    notifications_enabled: true,
    salary: undefined as number | undefined,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')

  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const { data } = await api.get<UserSettings>('/settings/profile')
      return data
    },
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        username: settings.username || 'Usuario',
        email: settings.email || '',
        currency: settings.currency || 'COP',
        notifications_enabled: settings.notifications_enabled ?? true,
        salary: settings.salary ?? undefined,
      })
    }
  }, [settings])

  const updateMutation = useMutation({
    mutationFn: async (update: ProfileUpdate) => {
      const { data } = await api.put<UserSettings>('/settings/profile', update)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] })
      onSave?.()
      setSaveStatus('success')
      setSaveMessage(`Salario de ${formatCurrency(data.salary || 0, data.currency || 'COP')} guardado correctamente`)
      setTimeout(() => setSaveStatus('idle'), 5000)
    },
    onError: (error: any) => {
      setSaveStatus('error')
      const message = error?.response?.data?.detail || 'Error al guardar los cambios'
      setSaveMessage(`Error: ${message}`)
    },
  })

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const update: ProfileUpdate = {
        username: formData.username,
        email: formData.email || undefined,
        currency: formData.currency,
        notifications_enabled: formData.notifications_enabled,
        salary: formData.salary,
      }
      await updateMutation.mutateAsync(update)
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            fontSize: '1.5rem',
            bgcolor: 'primary.main',
          }}
        >
          {getInitials(formData.username)}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {formData.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formData.email || 'Sin email'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            fullWidth
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Salario Mensual"
            type="number"
            fullWidth
            value={formData.salary ?? ''}
            onChange={(e) => handleChange('salary', Number(e.target.value) || undefined)}
            InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>$</Box> }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Moneda</InputLabel>
            <Select
              label="Moneda"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.name} ({c.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.notifications_enabled}
                onChange={(_e: React.ChangeEvent<HTMLInputElement>) => handleChange('notifications_enabled', _e.target.checked)}
              />
            }
            label="Notificaciones habilitadas"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Grid>
        {saveStatus !== 'idle' && (
          <Alert 
            severity={saveStatus} 
            sx={{ mt: 2, width: '100%' }}
            onClose={() => setSaveStatus('idle')}
          >
            {saveMessage}
          </Alert>
        )}
      </Grid>
    </Box>
  )
}