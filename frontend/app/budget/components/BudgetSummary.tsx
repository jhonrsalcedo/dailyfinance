'use client'

import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { formatCurrency } from '@/utils/currency'

interface BudgetSummaryProps {
  totalBudget: number
  totalSpent: number
  remaining: number
  currency: string
}

export default function BudgetSummary({ totalBudget, totalSpent, remaining, currency }: BudgetSummaryProps) {
  const theme = useTheme()

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Presupuesto Total
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatCurrency(totalBudget, currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{
            border: '1px solid',
            borderColor: 'divider',
            background: alpha(theme.palette.error.main, 0.04),
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Gastado
              </Typography>
              <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 700 }}>
                {formatCurrency(totalSpent, currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{
            border: '1px solid',
            borderColor: 'divider',
            background: alpha(theme.palette.success.main, 0.04),
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Restante
              </Typography>
              <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>
                {formatCurrency(remaining, currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}