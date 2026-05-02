'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api'
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  alpha,
  useTheme,
} from '@mui/material'
import { formatCurrency } from '@/utils/currency'
import { UserSettings } from '@/models'



interface Transaction {
  id: number
  amount: number
  date: string
  description: string | null
  category_id: number | null
}



function RecentTransactionsList() {
  const theme = useTheme()

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ['recentTransactions'],
    queryFn: async () => {
      const { data } = await api.get<Transaction[]>('/transactions')
      return data.slice(0, 5)
    },
  })

  const { data: categoriesData } = useQuery<{ id: number; name: string }[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
      return data
    },
  })

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings')
      return data
    },
  })

  const currency = settings?.currency || 'COP'

  const getCategory = (id: number | null) => {
    if (!id) return null
    return categoriesData?.find(c => c.id === id)
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No hay transacciones recientes
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Registra tu primera transacción arriba
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600}>
            Transacciones Recientes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Últimas transacciones del mes
          </Typography>
        </Box>
        <List sx={{ py: 0 }}>
          {transactions.map((transaction, index) => {
            const cat = getCategory(transaction.category_id)
            const isIncome = transaction.category_id === 1

            return (
              <ListItem
                key={transaction.id}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: index < transactions.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.description || 'Sin descripción'}
                      </Typography>
                      {cat && (
                        <Chip
                          size="small"
                          label={cat.name}
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {new Date(transaction.date).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </Typography>
                  }
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isIncome ? 'success.main' : 'error.main',
                  }}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </Typography>
              </ListItem>
            )
          })}
        </List>
        <Box sx={{ px: 3, py: 2, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => window.location.href = '/transactions'}
          >
            Ver todas las transacciones →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function RecentTransactions() {
  return <RecentTransactionsList />
}