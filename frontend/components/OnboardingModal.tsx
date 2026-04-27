'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material'
import { useTranslation } from '@/utils/i18n'
import api from '@/utils/api'

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const { language } = useTranslation()
  const [activeStep, setActiveStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [salary, setSalary] = useState('')

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleCloseModal = async () => {
    if (activeStep === 2 && salary) {
      try {
        await api.post('/settings', { salary: parseFloat(salary) })
      } catch (error) {
        console.error('Error saving salary:', error)
      }
    }
    setActiveStep(0)
    setGoal('')
    setSalary('')
    onClose()
  }

  const isSpanish = language === 'es'

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight={700}>
          {activeStep === 0 && (isSpanish ? '¡Bienvenido! Bienvenido a Daily Finance' : 'Welcome to Daily Finance!')}
          {activeStep === 1 && (isSpanish ? '¿Cuál es tu objetivo?' : 'What is your goal?')}
          {activeStep === 2 && (isSpanish ? 'Ingresa tu salario mensual' : 'Enter your monthly salary')}
          {activeStep === 3 && (isSpanish ? '¡Todo listo!' : 'All set!')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 300 }}>
        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>
              💰
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              {isSpanish
                ? 'La app que te ayuda a controlar tus finanzas personales'
                : 'The app that helps you manage your personal finances'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              {isSpanish
                ? 'Con Daily Finance puedes:'
                : 'With Daily Finance you can:'}
            </Typography>
            <Box sx={{ textAlign: 'left', display: 'inline-block' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>• {isSpanish ? 'Registrar tus ingresos y gastos' : 'Track your income and expenses'}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>• {isSpanish ? 'Ver estadísticas y gráficos' : 'View statistics and charts'}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>• {isSpanish ? 'Configurar presupuestos por categoría' : 'Set budgets by category'}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>• {isSpanish ? 'Analizar tu evolución mes a mes' : 'Analyze your progress month by month'}</Typography>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ py: 4 }}>
            <FormControl fullWidth>
              <RadioGroup value={goal} onChange={(e) => setGoal(e.target.value)}>
                <FormControlLabel
                  value="ahorrar"
                  control={<Radio />}
                  label={isSpanish ? '💵 Ahorrar dinero' : '💵 Save money'}
                  sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                />
                <FormControlLabel
                  value="controlar"
                  control={<Radio />}
                  label={isSpanish ? '📊 Controlar gastos' : '📊 Control expenses'}
                  sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                />
                <FormControlLabel
                  value="invertir"
                  control={<Radio />}
                  label={isSpanish ? '📈 Planificar inversiones' : '📈 Plan investments'}
                  sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              {isSpanish
                ? 'Ingresa tu salario mensual (opcional)'
                : 'Enter your monthly salary (optional)'}
            </Typography>
            <TextField
              label={isSpanish ? 'Salario mensual' : 'Monthly salary'}
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              sx={{ width: '100%', maxWidth: 300 }}
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
              {isSpanish
                ? 'Esto ayuda a calcular tu capacidad de ahorro'
                : 'This helps calculate your savings capacity'}
            </Typography>
          </Box>
        )}

        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>
              ✅
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {isSpanish
                ? '¡Estás listo para empezar!'
                : 'You are ready to get started!'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {isSpanish
                ? 'Recuerda que puedes configurar más opciones en Configuración'
                : 'Remember you can configure more options in Settings'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activeStep < 3 ? (
          <>
            <Button onClick={handleCloseModal} variant="outlined">
              {isSpanish ? 'Omitir' : 'Skip'}
            </Button>
            <Box sx={{ flex: 1 }} />
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined">
                {isSpanish ? 'Atrás' : 'Back'}
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={activeStep === 1 && !goal}
            >
              {isSpanish ? 'Continuar' : 'Continue'}
            </Button>
          </>
        ) : (
          <Button onClick={handleCloseModal} variant="contained" fullWidth>
            {isSpanish ? 'Empezar' : 'Get Started'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}