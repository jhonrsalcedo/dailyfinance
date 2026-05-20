'use client'

import { useTheme } from '@mui/material/styles'
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
} from '@mui/material'
import { formatCurrency } from '@/utils/currency'
import { DEMO_TRANSACTIONS, DEMO_CATEGORIES } from '@/data/demoData'

export default function DemoRecentTransactions() {
  const theme = useTheme()

  const getCategory = (id: number | null) => {
    if (!id) return null
    return DEMO_CATEGORIES.find(c => c.id === id)
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
          {DEMO_TRANSACTIONS.slice(0, 5).map((transaction, index) => {
            const cat = getCategory(transaction.category_id)
            const isIncome = transaction.category_id === 1

            return (
              <ListItem
                key={transaction.id}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: index < 4 ? '1px solid' : 'none',
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
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, 'COP')}
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
            onClick={() => window.location.href = '/login'}
          >
            Regístrate para ver tus transacciones →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}