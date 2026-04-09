'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  InputAdornment,
} from '@mui/material'
import { transactionSchema } from '@/schemas/transactionSchema'
import { Category, PaymentMethod, TransactionFormData } from '@/models'

const API_BASE_URL = 'http://localhost:8000/api/v1'

const categories: Category[] = [
  { id: 1, name: 'Ingresos' },
  { id: 2, name: 'Vivienda' },
  { id: 3, name: 'Transporte' },
  { id: 4, name: 'Alimentación' },
  { id: 5, name: 'Entretenimiento' },
  { id: 6, name: 'Salud' },
  { id: 7, name: 'Vehículo' },
  { id: 8, name: 'Familia' },
  { id: 9, name: 'Deudas/Crédito' },
  { id: 10, name: 'Misceláneos' },
]

const paymentMethods: PaymentMethod[] = [
  { id: 1, name: 'Efectivo' },
  { id: 2, name: 'Tarjeta Débito' },
  { id: 3, name: 'Tarjeta Crédito' },
]

export default function TransactionForm() {
  const queryClient = useQueryClient()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        await axios.get(`${API_BASE_URL}/categories`)
      } catch {
        console.log('Using local categories')
      }
      return categories
    },
  })

  const mutation = useMutation({
    mutationFn: async (newTransaction: TransactionFormData) => {
      const { data } = await axios.post(`${API_BASE_URL}/transactions`, newTransaction)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeStats'] })
      setSuccessMessage('¡Transacción registrada exitosamente!')
      setErrorMessage('')
      reset()
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } }; message?: string }
      setErrorMessage(err.response?.data?.detail || err.message || 'Error')
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
    mutation.mutate(formData)
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Registrar Nueva Transacción"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Monto"
                    type="number"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount?.message?.toString()}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === '' ? undefined : Number(val))
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Categoría"
                    fullWidth
                    error={!!errors.category_id}
                    helperText={errors.category_id?.message?.toString()}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <MenuItem value="" disabled>
                      Seleccionar categoría
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

            <Grid item xs={12} md={4}>
              <Controller
                name="method_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Método de Pago"
                    fullWidth
                    error={!!errors.method_id}
                    helperText={errors.method_id?.message?.toString()}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <MenuItem value="" disabled>
                      Seleccionar método
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

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message?.toString() || 'Ej: Pizza en Familia'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={mutation.isPending}
                sx={{ mt: 1 }}
              >
                {mutation.isPending ? 'Guardando...' : 'Registrar Transacción'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}