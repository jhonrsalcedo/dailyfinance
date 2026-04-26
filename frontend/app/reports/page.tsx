'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  useTheme,
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { formatCurrencyCOP } from '@/utils/currency'

const API_BASE_URL = 'http://localhost:8000/api/v1'

const COLORS = ['#1e40af', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#64748b']

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          borderRadius: 2,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((item, index) => (
          <Typography key={index} variant="body2" sx={{ color: item.color }}>
            {item.name}: {formatCurrencyCOP(item.value)}
          </Typography>
        ))}
      </Box>
    )
  }
  return null
}

export default function ReportsPage() {
  const theme = useTheme()
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))

  const { data: monthlyStats } = useQuery<{ month: string; income: number; expenses: number; balance: number }>({
    queryKey: ['monthlyStats', selectedMonth],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/stats/monthly?month=${selectedMonth}`)
      return data
    },
  })

  const { data: categoryStats = [] } = useQuery<{ category_id: number; category_name: string; total: number }[]>({
    queryKey: ['categoryStats', selectedMonth],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/stats/by-category?month=${selectedMonth}`)
      return data
    },
  })

  const { data: historyStats = [] } = useQuery<{ month: string; income: number; expenses: number }[]>({
    queryKey: ['historyStats'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/stats/history?months=6`)
      return data
    },
  })

  const totalIncome = monthlyStats?.income || 0
  const totalExpenses = monthlyStats?.expenses || 0
  const avgMonthly = totalExpenses

  const categoryData = categoryStats.map((cat, index) => ({
    name: cat.category_name,
    value: cat.total,
    color: COLORS[index % COLORS.length]
  }))

  const historyData = historyStats.map((m) => ({
    month: m.month.slice(5),
    income: m.income,
    expenses: m.expenses,
    balance: m.income - m.expenses
  }))

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Reportes
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Análisis detallado de tus finanzas
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2">Mes:</Typography>
        <TextField
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Ingresos Mes
              </Typography>
              <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>
                {formatCurrencyCOP(totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Gastos Mes
              </Typography>
              <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 700 }}>
                {formatCurrencyCOP(totalExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Balance Mes
              </Typography>
              <Typography variant="h5" sx={{ color: totalIncome - totalExpenses >= 0 ? 'success.main' : 'error.main', fontWeight: 700 }}>
                {formatCurrencyCOP(totalIncome - totalExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Promedio Mensual
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatCurrencyCOP(avgMonthly)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Ingresos vs Gastos
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income" name="Ingresos" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Gastos" fill={theme.palette.error.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Gastos por Categoría
              </Typography>
              {categoryData.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '85%' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hay gastos este mes
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrencyCOP(value)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ height: 350, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Tendencia de Ahorro
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="balance"
                    name="Ahorro" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}