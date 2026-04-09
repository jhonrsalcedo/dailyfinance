'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from '@mui/material'
import TransactionForm from '@/components/TransactionForm'
import CategoryChart from '@/components/CategoryChart'
import MonthlyTrend from '@/components/MonthlyTrend'
import { formatCurrencyCOP } from '@/utils/currency'
import { StatsResponse } from '@/models'

const API_BASE_URL = 'http://localhost:8000/api/v1'

async function fetchStats(): Promise<StatsResponse> {
  const { data } = await axios.get<StatsResponse>(`${API_BASE_URL}/transactions/stats`)
  return data
}

export default function Dashboard() {
  const { data, error, isLoading } = useQuery<StatsResponse>({
    queryKey: ['financeStats'],
    queryFn: fetchStats,
  })

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">
          Error al cargar datos: {error.message}
        </Typography>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6">
          Cargando datos...
        </Typography>
      </Container>
    )
  }

  const chartData = data.expenses_by_category.map((item) => ({
    name: item.category,
    value: item.total,
  }))

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Resumen Financiero Diario
        </Typography>

        <TransactionForm />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gastos Totales (Marzo)
                </Typography>
                <Typography variant="h3" color="error.main" fontWeight="bold">
                  {formatCurrencyCOP(data.total_expenses)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ingresos (Marzo)
                </Typography>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {formatCurrencyCOP(7878800)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Gastos por Categoría
                </Typography>
                <Box sx={{ height: 'calc(100% - 40px)' }}>
                  <CategoryChart data={chartData} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Tendencia Mensual
                </Typography>
                <Box sx={{ height: 'calc(100% - 40px)' }}>
                  <MonthlyTrend />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}