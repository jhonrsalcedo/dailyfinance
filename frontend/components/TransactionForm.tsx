'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
  Collapse,
  IconButton,
  Fade,
  alpha,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import PaymentsIcon from '@mui/icons-material/Payments'
import { transactionSchema } from '@/schemas/transactionSchema'
import { TransactionFormData } from '@/models'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export default function TransactionForm() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: categories = [] } = useQuery<Array<{id: number, name: string, icon?: string, color?: string}>>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/categories`)
      return data
    },
  })

  const { data: paymentMethods = [] } = useQuery<Array<{id: number, name: string, type: string}>>({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/payment-methods`)
      return data
    },
  })

  const mutation = useMutation({
    mutationFn: async (newTransaction: TransactionFormData) => {
      const { data } = await axios.post(
        `${API_BASE_URL}/transactions`,
        newTransaction
      )
      return data
    },
    onSuccess: () => {
      setSubmitting(false)
      queryClient.invalidateQueries({ queryKey: ['financeStats'] })
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] })
      setSuccessMessage('Transacción registrada')
      setErrorMessage('')
      setTimeout(() => {
        reset()
        setSuccessMessage('')
      }, 4000)
    },
    onError: (error: unknown) => {
      setSubmitting(false)
      const err = error as {
        response?: { data?: { detail?: string } }
        message?: string
      }
      setErrorMessage(
        err.response?.data?.detail || err.message || 'Error al registrar'
      )
      setSuccessMessage('')
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: undefined,
      category_id: undefined,
      method_id: undefined,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = (formData: TransactionFormData) => {
    setSubmitting(true)
    mutation.mutate(formData)
  }

  const isLoading = mutation.isPending || submitting

  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Agregar Movimientos
          </Typography>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <CardContent sx={{ p: 3 }}>
          {successMessage && (
            <Fade in={!!successMessage} timeout={300}>
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{ mb: 2, borderRadius: 1 }}
                onClose={() => setSuccessMessage('')}
              >
                {successMessage}
              </Alert>
            </Fade>
          )}

          {errorMessage && (
            <Fade in={!!errorMessage} timeout={300}>
              <Alert
                severity="error"
                sx={{ mb: 2, borderRadius: 1 }}
                onClose={() => setErrorMessage('')}
              >
                {errorMessage}
              </Alert>
            </Fade>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Monto"
                      type="number"
                      fullWidth
                      size="medium"
                      disabled={isLoading}
                      error={!!errors.amount}
                      helperText={errors.amount?.message?.toString()}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        field.onChange(val === '' ? undefined : Number(val))
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Categoría"
                      fullWidth
                      size="medium"
                      disabled={isLoading}
                      error={!!errors.category_id}
                      helperText={errors.category_id?.message?.toString()}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem value="" disabled>
                        --
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="method_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Método"
                      fullWidth
                      size="medium"
                      disabled={isLoading}
                      error={!!errors.method_id}
                      helperText={errors.method_id?.message?.toString()}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem value="" disabled>
                        --
                      </MenuItem>
                      {paymentMethods.map((method) => (
                        <MenuItem key={method.id} value={method.id}>
                          {method.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fecha"
                      type="date"
                      fullWidth
                      size="medium"
                      disabled={isLoading}
                      error={!!errors.date}
                      helperText={errors.date?.message?.toString()}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      placeholder="Opcional"
                      fullWidth
                      size="medium"
                      disabled={isLoading}
                      error={!!errors.description}
                      helperText={errors.description?.message?.toString()}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="medium"
                  disabled={submitting}
                  sx={{ minHeight: 47 }}
                >
                  {submitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    <>
                      <AddIcon sx={{ mr: 1 }} />
                      Agregar
                    </>
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Collapse>
    </Card>
  )
}