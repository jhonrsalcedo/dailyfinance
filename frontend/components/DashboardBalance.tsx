'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SavingsIcon from '@mui/icons-material/Savings'
import WarningIcon from '@mui/icons-material/Warning'
import { formatCurrencyCOP } from '@/utils/currency'
import { UserSettings, StatsResponse } from '@/models'

const API_BASE_URL = 'http://localhost:8000/api/v1'

interface BalanceCardProps {
  salary: number | null
  totalExpenses: number
}

function BalanceCard({ salary, totalExpenses }: BalanceCardProps) {
  const theme = useTheme()

  if (!salary) {
    return (
      <Card
        sx={{
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.warning.main, 0.1),
              }}
            >
              <WarningIcon sx={{ color: 'warning.main' }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Configura tu salary
              </Typography>
              <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                Ve a Configuración para establecer tu ingreso mensual
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const remaining = salary - totalExpenses
  const percentage = (totalExpenses / salary) * 100
  const isOverBudget = remaining < 0
  const isWarning = percentage > 80 && percentage <= 100

  let progressColor = theme.palette.success.main
  if (isOverBudget) progressColor = theme.palette.error.main
  else if (isWarning) progressColor = theme.palette.warning.main

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isOverBudget ? 'error.main' : 'divider',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${progressColor}, ${alpha(progressColor, 0.7)})`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(progressColor, 0.1),
            }}
          >
            <SavingsIcon sx={{ color: progressColor }} />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Gastado
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: progressColor }}>
              {percentage.toFixed(1)}%
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
          Balance Disponible
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: isOverBudget ? 'error.main' : 'text.primary',
            letterSpacing: '-0.02em',
          }}
        >
          {formatCurrencyCOP(remaining)}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Gastado: {formatCurrencyCOP(totalExpenses)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Salario: {formatCurrencyCOP(salary)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(progressColor, 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: progressColor,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {isWarning && !isOverBudget && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography variant="caption" sx={{ color: 'warning.main' }}>
              Has gastado más del 80% de tu salary
            </Typography>
          </Box>
        )}

        {isOverBudget && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              Has excedido tu salary por {formatCurrencyCOP(Math.abs(remaining))}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardBalance() {
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/settings`)
      return data
    },
  })

  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ['financeStats'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/transactions/stats`)
      return data
    },
  })

  return (
    <BalanceCard
      salary={settings?.salary || null}
      totalExpenses={stats?.total_expenses || 0}
    />
  )
}