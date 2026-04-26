'use client'

import { useState, useEffect } from 'react'

export const translations = {
  es: {
    app: {
      name: 'Daily Finance',
    },
    nav: {
      dashboard: 'Panel',
      transactions: 'Transacciones',
      reports: 'Reportes',
      budget: 'Presupuesto',
      settings: 'Configuración',
    },
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      username: 'Usuario',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      loginButton: 'Iniciar Sesión',
      registerButton: 'Crear Cuenta',
    },
    tooltip: {
      loginRequired: 'Regístrate para acceder a esta sección',
    },
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      loading: 'Cargando...',
      noData: 'No hay datos',
    },
    settings: {
      profile: 'Perfil',
      categories: 'Categorías',
      paymentMethods: 'Métodos de Pago',
      salary: 'Salario',
      currency: 'Moneda',
      notifications: 'Notificaciones',
    },
  },
  en: {
    app: {
      name: 'Daily Finance',
    },
    nav: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      reports: 'Reports',
      budget: 'Budget',
      settings: 'Settings',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      noAccount: 'No account?',
      hasAccount: 'Already have an account?',
      loginButton: 'Login',
      registerButton: 'Create Account',
    },
    tooltip: {
      loginRequired: 'Register to access this section',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      noData: 'No data',
    },
    settings: {
      profile: 'Profile',
      categories: 'Categories',
      paymentMethods: 'Payment Methods',
      salary: 'Salary',
      currency: 'Currency',
      notifications: 'Notifications',
    },
  },
}

export type Language = 'es' | 'en'

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('es')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguage(savedLang)
    } else {
      const browserLang = navigator.language.slice(0, 2)
      if (browserLang === 'en') setLanguage('en')
    }
  }, [])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return { t, language, changeLanguage }
}