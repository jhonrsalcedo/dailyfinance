import { Transaction, Category } from '@/models'

export const DEMO_CATEGORIES: Category[] = [
  { id: 1, name: 'Ingresos', icon: 'AttachMoney', color: '#4CAF50' },
  { id: 2, name: 'Vivienda', icon: 'Home', color: '#2196F3' },
  { id: 3, name: 'Transporte', icon: 'DirectionsCar', color: '#FF9800' },
  { id: 4, name: 'Alimentación', icon: 'Restaurant', color: '#E91E63' },
  { id: 5, name: 'Entretenimiento', icon: 'Movie', color: '#9C27B0' },
  { id: 6, name: 'Salud', icon: 'LocalHospital', color: '#F44336' },
  { id: 7, name: 'Vehículo', icon: 'DriveEta', color: '#607D8B' },
  { id: 8, name: 'Familia', icon: 'FamilyRestroom', color: '#795548' },
  { id: 9, name: 'Deudas/Crédito', icon: 'CreditCard', color: '#B71C1C' },
  { id: 10, name: 'Misceláneos', icon: 'MoreHoriz', color: '#9E9E9E' },
]

export const DEMO_PAYMENT_METHODS = [
  { id: 1, name: 'Efectivo' },
  { id: 2, name: 'Tarjeta Débito' },
  { id: 3, name: 'Tarjeta Crédito' },
]

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 1001,
    amount: 300000,
    category_id: 1,
    method_id: 2,
    description: 'Pago quincenal',
    date: '2026-05-01',
  },
  {
    id: 1002,
    amount: 450000,
    category_id: 4,
    method_id: 2,
    description: 'Mercado D1',
    date: '2026-05-01',
  },
  {
    id: 1003,
    amount: 60000,
    category_id: 5,
    method_id: 1,
    description: 'Cine Colombia',
    date: '2026-05-01',
  },
  {
    id: 1004,
    amount: 60000,
    category_id: 2,
    method_id: 1,
    description: 'Servicios',
    date: '2026-05-01',
  },
  {
    id: 1005,
    amount: 40000,
    category_id: 8,
    method_id: 3,
    description: 'Pizzas en Familia',
    date: '2026-05-09',
  },
  {
    id: 1006,
    amount: 400000,
    category_id: 1,
    method_id: 2,
    description: 'Pago quincenal',
    date: '2026-05-15',
  },
  {
    id: 1007,
    amount: 80000,
    category_id: 6,
    method_id: 2,
    description: 'Farmacia',
    date: '2026-05-18',
  },
]

export const DEMO_SETTINGS = {
  id: 0,
  username: 'Demo',
  email: 'demo@ejemplo.com',
  salary: 1500000,
  currency: 'COP',
  notifications_enabled: true,
  created_at: null,
  updated_at: null,
}

export const DEMO_STATS = {
  total_expenses: 610000,
  expenses_by_category: [
    { category: 'Alimentación', total: 450000, count: 2 },
    { category: 'Familia', total: 40000, count: 1 },
    { category: 'Entretenimiento', total: 60000, count: 1 },
    { category: 'Vivienda', total: 60000, count: 1 },
    { category: 'Salud', total: 80000, count: 1 },
  ],
}