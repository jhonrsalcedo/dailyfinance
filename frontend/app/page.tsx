'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button,
  Chip,
  alpha,
  useTheme,
} from '@mui/material'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SavingsIcon from '@mui/icons-material/Savings'
import LoginIcon from '@mui/icons-material/Login'
import TransactionForm from '@/components/TransactionForm'
import DashboardBalance from '@/components/DashboardBalance'
import RecentTransactions from '@/components/RecentTransactions'
import CategoryChart from '@/components/CategoryChart'
import MonthlyTrend from '@/components/MonthlyTrend'
import { formatCurrencyCOP } from '@/utils/currency'
import { StatsResponse, UserSettings } from '@/models'
import api from '@/utils/api'

const DEMO_STATS: StatsResponse = {
  total_expenses: 2850000,
  expenses_by_category: [
    { category: 'Vivienda', total: 1200000, count: 4 },
    { category: 'Alimentación', total: 850000, count: 12 },
    { category: 'Transporte', total: 350000, count: 8 },
    { category: 'Entretenimiento', total: 250000, count: 5 },
    { category: 'Salud', total: 200000, count: 2 },
  ],
}

const DEMO_SETTINGS = {
  id: 0,
  username: 'Demo',
  email: 'demo@ejemplo.com',
  salary: 5000000,
  currency: 'COP',
  notifications_enabled: true,
  created_at: null,
  updated_at: null,
}

async function fetchStats(): Promise<StatsResponse> {
  const { data } = await api.get<StatsResponse>('/transactions/stats')
  return data
}

async function fetchSettings(): Promise<UserSettings> {
  const { data } = await api.get<UserSettings>('/settings')
  return data
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: 'primary' | 'success' | 'error' | 'warning'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const theme = useTheme()
  const colorMap = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
  }
  const mainColor = colorMap[color]

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${mainColor}, ${alpha(mainColor, 0.7)})`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(mainColor, 0.1),
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const { data: stats, isLoading: statsLoading } = useQuery<StatsResponse>({
    queryKey: ['financeStats'],
    queryFn: fetchStats,
    enabled: isAuthenticated,
  })

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    enabled: isAuthenticated,
  })

  const displayStats = isAuthenticated ? stats : DEMO_STATS
  const displaySettings = isAuthenticated ? settings : DEMO_SETTINGS

  if (statsLoading && isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Cargando...</Typography>
        </Box>
      </Box>
    )
  }

  if (!displayStats) return null

  const chartData = displayStats.expenses_by_category.map((item) => ({
    name: item.category,
    value: item.total,
  }))

  const salary = displaySettings?.salary || 0
  const balance = salary - displayStats.total_expenses

  return (
    <Container maxWidth="xl" sx={{ pb: { xs: 10, md: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight={700} sx={{ mb: 0.5 }}>
            Resumen Financiero
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Monitorea tus finanzas {isAuthenticated ? 'en tiempo real' : '(Demo)'}
          </Typography>
        </Box>
        {!isAuthenticated && (
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            href="/login"
            size="small"
          >
            Iniciar Sesión
          </Button>
        )}
      </Box>

      {!isAuthenticated && (
        <Chip
          label="Modo Demo - Datos de ejemplo"
          color="info"
          sx={{ mb: 3 }}
        />
      )}

      {isAuthenticated && <TransactionForm />}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          {isAuthenticated ? <DashboardBalance /> : (
            <StatCard
              title="Salario"
              value={formatCurrencyCOP(DEMO_STATS.total_expenses * 2)}
              icon={<AccountBalanceWalletIcon sx={{ color: 'primary.main', fontSize: 20 }} />}
              color="primary"
            />
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <StatCard
                title="Gastos del Mes"
                value={formatCurrencyCOP(displayStats.total_expenses)}
                icon={<TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                color="error"
              />
            </Grid>
            <Grid item xs={6}>
              <StatCard
                title="Balance"
                value={formatCurrencyCOP(balance)}
                icon={<SavingsIcon sx={{ color: balance >= 0 ? 'success.main' : 'error.main', fontSize: 20 }} />}
                color={balance >= 0 ? 'success' : 'error'}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          {isAuthenticated && <RecentTransactions />}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 380, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Gastos por Categoría</Typography>
              </Box>
              <Box sx={{ flex: 1, minHeight: 250 }}>
                <CategoryChart data={chartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 380, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Tendencia Mensual</Typography>
              </Box>
              <Box sx={{ flex: 1, minHeight: 250 }}>
                <MonthlyTrend />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}