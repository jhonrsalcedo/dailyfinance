'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/utils/api'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatCurrency } from '@/utils/currency'
import { Category, UserSettings } from '@/models'
import { BudgetSkeleton } from '@/components/skeletons'



interface BudgetData {
  id: number
  month: string
  category_id: number
  limit_amount: number
  spent_amount: number
  remaining: number
  category_name?: string
}

export default function BudgetPage() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBudget, setEditingBudget] = useState<BudgetData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))

  const [formData, setFormData] = useState({ category_id: '', limit_amount: '' })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
      return data
    },
  })

  const { data: budgets = [], isLoading } = useQuery<BudgetData[]>({
    queryKey: ['budgets', selectedMonth],
    queryFn: async () => {
      const { data } = await api.get(`/budget?month=${selectedMonth}`)
      return data.map((b: any) => ({
        ...b,
        category_name: categories?.find((c: Category) => c.id === b.category_id)?.name || 'Sin categoría'
      }))
    },
  })

  const createMutation = useMutation({
    mutationFn: async (budget: { month: string; category_id: number; limit_amount: number }) => {
      const { data } = await api.post('/budget', budget)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      handleCloseDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, budget }: { id: number; budget: { limit_amount: number } }) => {
      const { data } = await api.put(`/budget/${id}`, budget)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      handleCloseDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/budget/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })

  const categoriesMap = categories?.reduce((acc: Record<number, string>, cat: Category) => {
    acc[cat.id] = cat.name
    return acc
  }, {}) || {}

  const getCategoryName = (id: number) => categoriesMap[id] || 'Sin categoría'

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings')
      return data
    },
  })

  const currency = settings?.currency || 'COP'

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit_amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent_amount, 0)
  const remaining = totalBudget - totalSpent

  const handleOpenDialog = (budget?: BudgetData) => {
    if (budget) {
      setEditingBudget(budget)
      setFormData({ category_id: String(budget.category_id), limit_amount: String(budget.limit_amount) })
    } else {
      setEditingBudget(null)
      setFormData({ category_id: '', limit_amount: '' })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingBudget(null)
    setFormData({ category_id: '', limit_amount: '' })
  }

  const handleSave = () => {
    const budgetData = {
      month: selectedMonth,
      category_id: parseInt(formData.category_id),
      limit_amount: parseFloat(formData.limit_amount)
    }

    if (editingBudget) {
      updateMutation.mutate({ id: editingBudget.id, budget: { limit_amount: parseFloat(formData.limit_amount) } })
    } else {
      createMutation.mutate(budgetData)
    }
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Presupuesto
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Configura límites de gasto por categoría
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

      <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Límites por Categoría
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size={isMobile ? 'small' : 'medium'}
              fullWidth={isMobile}
            >
              Agregar
            </Button>
          </Box>

          <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Límite</TableCell>
                  <TableCell align="right">Gastado</TableCell>
                  <TableCell align="right">Restante</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <BudgetSkeleton />
                    </TableCell>
                  </TableRow>
                ) : budgets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No hay presupuestos para este mes
                    </TableCell>
                  </TableRow>
                ) : budgets.map((budget) => {
                  const progress = budget.limit_amount > 0 ? (budget.spent_amount / budget.limit_amount) * 100 : 0
                  const isOverBudget = progress > 100
                  const isWarning = progress > 80 && progress <= 100
                  
                  let progressColor = theme.palette.success.main
                  if (isOverBudget) progressColor = theme.palette.error.main
                  else if (isWarning) progressColor = theme.palette.warning.main

                  return (
                    <TableRow key={budget.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>{getCategoryName(budget.category_id)}</Typography>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(budget.limit_amount, currency)}</TableCell>
                       <TableCell align="right">{formatCurrency(budget.spent_amount, currency)}</TableCell>
                       <TableCell align="right" sx={{ color: budget.remaining < 0 ? 'error.main' : 'text.primary' }}>
                         {formatCurrency(budget.remaining, currency)}
                       </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(progress, 100)}
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: alpha(progressColor, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: progressColor,
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ minWidth: 40 }}>
                            {progress.toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(budget)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(budget.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {isMobile && (
            <Box sx={{ mt: 2 }}>
              {budgets.length === 0 ? (
                <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No hay presupuestos para este mes
                </Typography>
              ) : budgets.map((budget) => {
                const progress = budget.limit_amount > 0 ? (budget.spent_amount / budget.limit_amount) * 100 : 0
                const isOverBudget = progress > 100
                const isWarning = progress > 80 && progress <= 100
                
                let progressColor = theme.palette.success.main
                if (isOverBudget) progressColor = theme.palette.error.main
                else if (isWarning) progressColor = theme.palette.warning.main

                return (
                  <Card key={budget.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {getCategoryName(budget.category_id)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                             <Chip
                               label={`Límite: ${formatCurrency(budget.limit_amount, currency)}`}
                               size="small"
                               sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}
                             />
                             <Chip
                               label={`${formatCurrency(budget.remaining, currency)}`}
                               size="small"
                               color={budget.remaining < 0 ? 'error' : 'success'}
                               variant="outlined"
                             />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" color="primary" onClick={() => handleOpenDialog(budget)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(budget.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                             Gastado: {formatCurrency(budget.spent_amount, currency)}
                           </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: progressColor }}>
                            {progress.toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: alpha(progressColor, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: progressColor,
                              borderRadius: 5,
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Editar Límite' : 'Agregar Límite'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={!!editingBudget}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.category_id}
                  label="Categoría"
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  {categories?.map((cat: Category) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Límite"
                type="number"
                fullWidth
                value={formData.limit_amount}
                onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!formData.category_id || !formData.limit_amount}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}