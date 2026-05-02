'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  alpha,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import PersonIcon from '@mui/icons-material/Person'
import CategoryIcon from '@mui/icons-material/Category'
import PaymentIcon from '@mui/icons-material/Payment'
import HomeTourIcon from '@mui/icons-material/HomeWork'
import { formatCurrency } from '@/utils/currency'
import { UserSettings } from '@/models'
import { UserProfile } from '@/components/UserProfile'
import { IconPicker, getMUIcon } from '@/components/IconPicker'
import { OnboardingModal } from '@/components/OnboardingModal'
import { SettingsSkeleton } from '@/components/skeletons'
import api from '@/utils/api'

interface Category {
  id: number
  name: string
  icon?: string
  color?: string
}

interface PaymentMethod {
  id: number
  name: string
  type?: string
}

interface CategoryDialogProps {
  open: boolean
  onClose: () => void
  category: Category | null
  onSave: (category: Partial<Category>) => void
}

function CategoryDialog({ open, onClose, category, onSave }: CategoryDialogProps) {
  const [formData, setFormData] = useState({ name: '', icon: '', color: '#1e40af' })

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name, icon: category.icon || '', color: category.color || '#1e40af' })
    } else {
      setFormData({ name: '', icon: '', color: '#1e40af' })
    }
  }, [category])

  const handleSave = () => {
    if (!formData.name.trim()) return
    onSave({ ...formData, id: category?.id })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <IconPicker
              value={formData.icon}
              onChange={icon => setFormData({ ...formData, icon })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Color"
              type="color"
              fullWidth
              value={formData.color}
              onChange={e => setFormData({ ...formData, color: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={!formData.name.trim()}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function SettingsPage() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [tabValue, setTabValue] = useState(0)
  const [salary, setSalary] = useState<string>('')
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')

   const { data: settings, isLoading: settingsLoading } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<UserSettings>('/settings')
      return data
    },
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories')
      return data
    },
  })

  const { data: methodsData, isLoading: methodsLoading } = useQuery<PaymentMethod[]>({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const { data } = await api.get<PaymentMethod[]>('/payment-methods')
      return data
    },
  })

  useEffect(() => {
    if (categoriesData) {
      setCategoryList(categoriesData)
    }
  }, [categoriesData])

  useEffect(() => {
    if (settings?.salary) {
      setSalary(String(settings.salary))
    }
  }, [settings])

  const updateSalaryMutation = useMutation({
    mutationFn: async (newSalary: number) => {
      await api.post('/settings', { salary: newSalary })
    },
    onSuccess: (_, newSalary) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      setSaveStatus('success')
       setSaveMessage(`Salario de ${formatCurrency(newSalary as number, settings?.currency || 'COP')} guardado correctamente`)
      setSnackbar({ open: true, message: 'Salario guardado exitosamente', severity: 'success' })
      setTimeout(() => setSaveStatus('idle'), 5000)
    },
    onError: (error: any) => {
      setSaveStatus('error')
      const message = error?.response?.data?.detail || 'Error al guardar el salario'
      setSaveMessage(`Error: ${message}`)
      setSnackbar({ open: true, message, severity: 'error' })
    },
  })

  const handleSalarySave = () => {
    const salaryNum = parseFloat(salary)
    if (!isNaN(salaryNum) && salaryNum > 0) {
      updateSalaryMutation.mutate(salaryNum)
    }
  }

  const handleCategorySave = async (category: Partial<Category>) => {
    if (category.id) {
      const { data } = await api.put(`/categories/${category.id}`, category)
      setCategoryList(categoryList.map(c => c.id === category.id ? data : c))
    } else {
      const { data } = await api.post('/categories', category)
      setCategoryList([...categoryList, data])
    }
    setCategoryDialog({ open: false, category: null })
  }

  const handleCategoryDelete = async (id: number) => {
    if (id <= 10) {
      alert('No puedes eliminar las categorías por defecto')
      return
    }
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return
    }
    try {
      await api.delete(`/categories/${id}`)
      setCategoryList(categoryList.filter(c => c.id !== id))
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      alert(err.response?.data?.detail || 'Error al eliminar la categoría')
    }
  }

  if (settingsLoading || categoriesLoading || methodsLoading) {
    return <SettingsSkeleton />
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Configuración
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Administra tu información personal y categorías
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeTourIcon />}
          onClick={() => setOnboardingOpen(true)}
          sx={{ mt: 1, fontWeight: 600 }}
        >
          ¿Cómo usar la App?
        </Button>
      </Box>

      <OnboardingModal
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 48,
            minWidth: 'auto',
            px: 2,
          },
        }}
      >
        <Tab icon={<PersonIcon />} iconPosition="top" label="Perfil" />
        <Tab icon={<CategoryIcon />} iconPosition="top" label="Categorías" />
        <Tab icon={<PaymentIcon />} iconPosition="top" label="Pagos" />
      </Tabs>

      {tabValue === 0 && (
        <UserProfile />
      )}

      {tabValue === 1 && (
        <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Categorías
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setCategoryDialog({ open: true, category: null })}
              >
                Nueva Categoría
              </Button>
            </Box>
            <Grid container spacing={2}>
              {categoryList.map(category => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {(() => {
                        const IconComp = getMUIcon(category.icon || '')
                        return (
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              bgcolor: alpha(category.color || '#1e40af', 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {IconComp ? (
                              <IconComp sx={{ fontSize: 20, color: category.color || '#1e40af' }} />
                            ) : (
                              <Box sx={{ fontSize: '1.25rem' }}>📁</Box>
                            )}
                          </Box>
                        )
                      })()}
                      <Typography fontWeight={500}>{category.name}</Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => setCategoryDialog({ open: true, category })}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCategoryDelete(category.id)}
                        disabled={category.id <= 10}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Salario Mensual
                </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="Salario"
                    type="number"
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSalarySave}
                    disabled={updateSalaryMutation.isPending}
                  >
                    Guardar
                  </Button>
                  {updateSalaryMutation.isSuccess && (
                    <Typography
                      color="success.main"
                      sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    >
                      ✅ Guardado
                    </Typography>
                  )}
                </Box>
                {saveStatus !== 'idle' && (
                  <Alert 
                    severity={saveStatus} 
                    sx={{ mt: 2, alignItems: 'center' }}
                    onClose={() => setSaveStatus('idle')}
                  >
                    {saveMessage}
                  </Alert>
                )}
                {settings?.salary && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                     Último salario guardado: {formatCurrency(settings.salary, settings?.currency || 'COP')}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Métodos de Pago
                </Typography>
                <List>
                  {methodsData?.map(method => (
                    <ListItem key={method.id} divider>
                      <ListItemText
                        primary={method.name}
                        secondary={method.type === 'cash' ? 'Efectivo' : method.type === 'debit' ? 'Débito' : 'Crédito'}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <CategoryDialog
        open={categoryDialog.open}
        onClose={() => setCategoryDialog({ open: false, category: null })}
        category={categoryDialog.category}
        onSave={handleCategorySave}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}