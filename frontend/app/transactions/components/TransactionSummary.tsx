'use client'

import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { formatCurrency } from '@/utils/currency'

interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  currency: string
}

export default function TransactionSummary({ totalIncome, totalExpenses, currency }: SummaryCardsProps) {
  const theme = useTheme()

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            border: '1px solid',
            borderColor: 'divider',
            background: alpha(theme.palette.success.main, 0.04),
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Ingresos Totales
              </Typography>
              <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>
                {formatCurrency(totalIncome, currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            border: '1px solid',
            borderColor: 'divider',
            background: alpha(theme.palette.error.main, 0.04),
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Gastos Totales
              </Typography>
              <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 700 }}>
                {formatCurrency(totalExpenses, currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Balance
              </Typography>
              <Typography variant="h5" sx={{
                color: totalIncome - totalExpenses >= 0 ? 'success.main' : 'error.main',
                fontWeight: 700
              }}>
                {formatCurrency(totalIncome - totalExpenses, currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}