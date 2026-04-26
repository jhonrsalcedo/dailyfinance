'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  alpha,
  useTheme,
  Button,
  Chip,
  useMediaQuery,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import { formatCurrencyCOP } from '@/utils/currency'
import { Transaction, Category, PaymentMethod } from '@/models'
import { Loading } from '@/components/Loading'

const API_BASE_URL = 'http://localhost:8000/api/v1'

function getCategoryName(id: number | null, categories: Category[]): string {
  if (!id) return '-'
  return categories.find(c => c.id === id)?.name || '-'
}

function getMethodName(id: number | null, methods: PaymentMethod[]): string {
  if (!id) return '-'
  return methods.find(m => m.id === id)?.name || '-'
}

function getCategoryColor(_id: number | null): string {
  return '#64748b'
}

export default function TransactionsPage() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('')

  const { data: transactionsData, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await axios.get<Transaction[]>(`${API_BASE_URL}/transactions`)
      return data
    },
  })

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/categories`)
      return data
    },
  })

  const { data: methodsData } = useQuery<PaymentMethod[]>({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/payment-methods`)
      return data
    },
  })

  const categories = categoriesData || []
  const paymentMethods = methodsData || []

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['financeStats'] })
    },
  })

  const transactions = transactionsData || []

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = !searchTerm || 
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(t.category_id, categories).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || t.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const displayedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const totalExpenses = filteredTransactions
    .filter(t => t.category_id !== 1)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = filteredTransactions
    .filter(t => t.category_id === 1)
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Transacciones
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Historial completo de tus ingresos y gastos
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => window.open(`${API_BASE_URL}/transactions/export`, '_blank')}
          sx={{ flexShrink: 0 }}
        >
          Exportar
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                {formatCurrencyCOP(totalIncome)}
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
                {formatCurrencyCOP(totalExpenses)}
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
                {formatCurrencyCOP(totalIncome - totalExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Total Transacciones
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {filteredTransactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              placeholder="Buscar transacciones..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, minWidth: { sm: 200 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: { sm: 180 } }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryFilter}
                label="Categoría"
                onChange={(e) => setCategoryFilter(e.target.value as number | '')}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map((cat: Category) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Loading />
                    </TableCell>
                  </TableRow>
                ) : displayedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No hay transacciones
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedTransactions.map((transaction) => {
                    const isIncome = transaction.category_id === 1
                    return (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString('es-CO')}
                        </TableCell>
                        <TableCell>{transaction.description || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={getCategoryName(transaction.category_id, categories)}
                            sx={{
                              bgcolor: alpha(getCategoryColor(transaction.category_id), 0.1),
                              color: getCategoryColor(transaction.category_id),
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>{getMethodName(transaction.method_id, paymentMethods)}</TableCell>
                        <TableCell align="right">
                          <Typography
                            sx={{
                              color: isIncome ? 'success.main' : 'error.main',
                              fontWeight: 600,
                            }}
                          >
                            {isIncome ? '+' : '-'}{formatCurrencyCOP(transaction.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => deleteMutation.mutate(transaction.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {isMobile && (
            <Box sx={{ mt: 2 }}>
              {displayedTransactions.length === 0 ? (
                <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  {isLoading ? 'Cargando...' : 'No hay transacciones'}
                </Typography>
              ) : displayedTransactions.map((transaction) => {
                const isIncome = transaction.category_id === 1
                return (
                  <Card key={transaction.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {transaction.description || 'Sin descripción'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(transaction.date).toLocaleDateString('es-CO')}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: isIncome ? 'success.main' : 'error.main',
                            fontWeight: 700,
                            fontSize: '1rem',
                          }}
                        >
                          {isIncome ? '+' : '-'}{formatCurrencyCOP(transaction.amount)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          size="small"
                          label={getCategoryName(transaction.category_id, categories)}
                          sx={{
                            bgcolor: alpha(getCategoryColor(transaction.category_id), 0.1),
                            color: getCategoryColor(transaction.category_id),
                          }}
                        />
                        <Chip
                          size="small"
                          label={getMethodName(transaction.method_id, paymentMethods)}
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteMutation.mutate(transaction.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          )}

          <TablePagination
            component="div"
            count={filteredTransactions.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </Container>
  )
}