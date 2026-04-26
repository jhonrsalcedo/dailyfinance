'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  InputAdornment,
  IconButton,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { authApi } from '@/utils/auth'
import { registerSchema, PASSWORD_REQUIREMENTS } from '@/schemas/authSchema'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordValidation = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map(req => ({
      ...req,
      passed: req.test(password),
    }))
  }, [password])

  const isPasswordValid = useMemo(() => {
    return registerSchema.shape.password.safeParse(password).success
  }, [password])

  const passwordsMatch = useMemo(() => {
    return confirmPassword.length === 0 || password === confirmPassword
  }, [password, confirmPassword])

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const isEmailValid = useMemo(() => {
    return emailRegex.test(email)
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }

      if (!isEmailValid) {
        setError('Por favor ingresa un email válido')
        return
      }

      const result = registerSchema.safeParse({ email, password, username })
      if (!result.success) {
        setError(result.error.errors[0].message)
        return
      }
    } else {
      if (!email) {
        setError('El email es requerido')
        return
      }
    }

    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await authApi.register(email, password, username || undefined)
        await login(email, password)
      }
      router.push('/')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } }
      setError(e.response?.data?.detail || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 450 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
                error={!isLogin && email.length > 0 && !isEmailValid}
                helperText={!isLogin && email.length > 0 && !isEmailValid ? 'Email inválido. Ejemplo: usuario@ejemplo.com' : ''}
              />

              {!isLogin && (
                <TextField
                  label="Nombre"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {!isLogin && (
                <Collapse in={!isLogin && password.length > 0}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                      Requisitos de password:
                    </Typography>
                    <List dense disablePadding>
                      {passwordValidation.map((req) => (
                        <ListItem key={req.id} disablePadding sx={{ py: 0.25 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            {req.passed ? (
                              <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <CloseIcon sx={{ fontSize: 16, color: 'error.main' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={req.label}
                            primaryTypographyProps={{
                              variant: 'caption',
                              color: req.passed ? 'success.main' : 'text.secondary',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              )}

              {!isLogin && (
                <TextField
                  label="Confirmar Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  error={!passwordsMatch && confirmPassword.length > 0}
                  helperText={!passwordsMatch && confirmPassword.length > 0 ? 'Las contraseñas no coinciden' : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || (!isLogin && (!isPasswordValid || !passwordsMatch))}
                sx={{ mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : isLogin ? 'Entrar' : 'Registrarse'}
              </Button>
            </form>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" textAlign="center">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <Box
                component="span"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </Box>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}