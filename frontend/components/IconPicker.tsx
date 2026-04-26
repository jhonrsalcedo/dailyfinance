'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Popover,
  Grid,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Home from '@mui/icons-material/Home'
import DirectionsCar from '@mui/icons-material/DirectionsCar'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Restaurant from '@mui/icons-material/Restaurant'
import Movie from '@mui/icons-material/Movie'
import LocalHospital from '@mui/icons-material/LocalHospital'
import Flight from '@mui/icons-material/Flight'
import School from '@mui/icons-material/School'
import CreditCard from '@mui/icons-material/CreditCard'
import AttachMoney from '@mui/icons-material/AttachMoney'
import FitnessCenter from '@mui/icons-material/FitnessCenter'
import Pets from '@mui/icons-material/Pets'
import Coffee from '@mui/icons-material/Coffee'
import SportsEsports from '@mui/icons-material/SportsEsports'
import MusicNote from '@mui/icons-material/MusicNote'
import Wifi from '@mui/icons-material/Wifi'
import PhoneAndroid from '@mui/icons-material/PhoneAndroid'
import Laptop from '@mui/icons-material/Laptop'
import Work from '@mui/icons-material/Work'
import Savings from '@mui/icons-material/Savings'
import AccountBalance from '@mui/icons-material/AccountBalance'
import ChildCare from '@mui/icons-material/ChildCare'
import Favorite from '@mui/icons-material/Favorite'
import Star from '@mui/icons-material/Star'
import Phone from '@mui/icons-material/Phone'
import LocalGasStation from '@mui/icons-material/LocalGasStation'
import Build from '@mui/icons-material/Build'
import Checkroom from '@mui/icons-material/Checkroom'
import LocalLaundryService from '@mui/icons-material/LocalLaundryService'
import BakeryDining from '@mui/icons-material/BakeryDining'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import AccountTree from '@mui/icons-material/AccountTree'
import Analytics from '@mui/icons-material/Analytics'
import Calculate from '@mui/icons-material/Calculate'
import MoneyOff from '@mui/icons-material/MoneyOff'
import Paid from '@mui/icons-material/Paid'
import Payment from '@mui/icons-material/Payment'
import PriceCheck from '@mui/icons-material/PriceCheck'
import Receipt from '@mui/icons-material/Receipt'
import Wallet from '@mui/icons-material/Wallet'
import Business from '@mui/icons-material/Business'
import BusinessCenter from '@mui/icons-material/BusinessCenter'
import Factory from '@mui/icons-material/Factory'
import Store from '@mui/icons-material/Store'
import LocalAtm from '@mui/icons-material/LocalAtm'
import MonetizationOn from '@mui/icons-material/MonetizationOn'
import ShowChart from '@mui/icons-material/ShowChart'
import TrendingUp from '@mui/icons-material/TrendingUp'
import TrendingDown from '@mui/icons-material/TrendingDown'
import CandlestickChart from '@mui/icons-material/CandlestickChart'
import BarChart from '@mui/icons-material/BarChart'
import ShoppingBag from '@mui/icons-material/ShoppingBag'
import LocalGroceryStore from '@mui/icons-material/LocalGroceryStore'
import LocalMall from '@mui/icons-material/LocalMall'
import Storefront from '@mui/icons-material/Storefront'
import Train from '@mui/icons-material/Train'
import DirectionsBus from '@mui/icons-material/DirectionsBus'
import TaxiAlert from '@mui/icons-material/TaxiAlert'
import ElectricScooter from '@mui/icons-material/ElectricScooter'
import FlightTakeoff from '@mui/icons-material/FlightTakeoff'
import KingBed from '@mui/icons-material/KingBed'
import Kitchen from '@mui/icons-material/Kitchen'
import Bathroom from '@mui/icons-material/Bathroom'
import Garage from '@mui/icons-material/Garage'
import Pool from '@mui/icons-material/Pool'
import MedicalServices from '@mui/icons-material/MedicalServices'
import Psychology from '@mui/icons-material/Psychology'
import Vaccines from '@mui/icons-material/Vaccines'
import Science from '@mui/icons-material/Science'
import HistoryEdu from '@mui/icons-material/HistoryEdu'
import Fastfood from '@mui/icons-material/Fastfood'
import LocalConvenienceStore from '@mui/icons-material/LocalConvenienceStore'
import Handshake from '@mui/icons-material/Handshake'
import VolunteerActivism from '@mui/icons-material/VolunteerActivism'
import SavingsOutlined from '@mui/icons-material/SavingsOutlined'


const ICONS = [
  // Finanzas y Banco
  { name: 'account_balance', Icon: AccountBalance, label: 'Banco' },
  { name: 'account_balance_wallet', Icon: AccountBalanceWallet, label: 'Billetera' },
  { name: 'account_tree', Icon: AccountTree, label: 'Organización' },
  { name: 'analytics', Icon: Analytics, label: 'Analítica' },
  { name: 'calculate', Icon: Calculate, label: 'Calcular' },
  { name: 'money_off', Icon: MoneyOff, label: 'Sin dinero' },
  { name: 'paid', Icon: Paid, label: 'Pagado' },
  { name: 'payment', Icon: Payment, label: 'Pago' },
  { name: 'price_check', Icon: PriceCheck, label: 'Verificar precio' },
  { name: 'receipt', Icon: Receipt, label: 'Recibo' },
  { name: 'wallet', Icon: Wallet, label: 'Cartertera' },
  { name: 'savings', Icon: Savings, label: 'Ahorros' },
  { name: 'savings_outlined', Icon: SavingsOutlined, label: 'Ahorros' },
  { name: 'local_atm', Icon: LocalAtm, label: 'Cajero' },
  { name: 'monetization_on', Icon: MonetizationOn, label: 'Moneda' },
  { name: 'credit_card', Icon: CreditCard, label: 'Tarjeta crédito' },
  { name: 'attach_money', Icon: AttachMoney, label: 'Dinero' },

  // Inversiones y Gráficos
  { name: 'show_chart', Icon: ShowChart, label: 'Gráfico' },
  { name: 'trending_up', Icon: TrendingUp, label: 'Subiendo' },
  { name: 'trending_down', Icon: TrendingDown, label: 'Bajando' },
  { name: 'candlestick_chart', Icon: CandlestickChart, label: 'Velas' },
  { name: 'bar_chart', Icon: BarChart, label: 'Barras' },

  // Negocios
  { name: 'business', Icon: Business, label: 'Negocio' },
  { name: 'business_center', Icon: BusinessCenter, label: 'Oficina' },
  { name: 'factory', Icon: Factory, label: 'Fábrica' },
  { name: 'store', Icon: Store, label: 'Tienda' },
  { name: 'storefront', Icon: Storefront, label: 'Vidriera' },
  { name: 'handshake', Icon: Handshake, label: 'Acuerdo' },

  // Compras
  { name: 'shopping_cart', Icon: ShoppingCart, label: 'Carrito' },
  { name: 'shopping_bag', Icon: ShoppingBag, label: 'Bolsa' },
  { name: 'local_grocery_store', Icon: LocalGroceryStore, label: 'Supermercado' },
  { name: 'local_mall', Icon: LocalMall, label: 'Centro comercial' },
  { name: 'local_convenience_store', Icon: LocalConvenienceStore, label: 'Tienda' },

  // Comida y Restaurantes
  { name: 'restaurant', Icon: Restaurant, label: 'Restaurante' },
  { name: 'fastfood', Icon: Fastfood, label: 'Comida rápida' },
  { name: 'bakery_dining', Icon: BakeryDining, label: 'Panadería' },
  { name: 'coffee', Icon: Coffee, label: 'Café' },

  // Transporte
  { name: 'directions_car', Icon: DirectionsCar, label: 'Carro' },
  { name: 'directions_bus', Icon: DirectionsBus, label: 'Bus' },
  { name: 'train', Icon: Train, label: 'Tren' },
  { name: 'taxi_alert', Icon: TaxiAlert, label: 'Taxi' },
  { name: 'electric_scooter', Icon: ElectricScooter, label: 'Patineta' },
  { name: 'flight', Icon: Flight, label: 'Avión' },
  { name: 'flight_takeoff', Icon: FlightTakeoff, label: 'Despegar' },
  { name: 'local_gas_station', Icon: LocalGasStation, label: 'Gasolina' },

  // Hogar
  { name: 'home', Icon: Home, label: 'Casa' },
  { name: 'king_bed', Icon: KingBed, label: 'Dormitorio' },
  { name: 'kitchen', Icon: Kitchen, label: 'Cocina' },
  { name: 'bathroom', Icon: Bathroom, label: 'Baño' },
  { name: 'garage', Icon: Garage, label: 'Garaje' },
  { name: 'pool', Icon: Pool, label: 'Piscina' },

  // Salud
  { name: 'local_hospital', Icon: LocalHospital, label: 'Hospital' },
  { name: 'medical_services', Icon: MedicalServices, label: 'Servicios médicos' },
  { name: 'psychology', Icon: Psychology, label: 'Psicología' },
  { name: 'vaccines', Icon: Vaccines, label: 'Vacunas' },
  { name: 'fitness_center', Icon: FitnessCenter, label: 'Gimnasio' },

  // Educación
  { name: 'school', Icon: School, label: 'Escuela' },
  { name: 'science', Icon: Science, label: 'Ciencia' },
  { name: 'history_edu', Icon: HistoryEdu, label: 'Historia' },

  // Entretenimiento
  { name: 'movie', Icon: Movie, label: 'Cine' },
  { name: 'sports_esports', Icon: SportsEsports, label: 'Videojuegos' },
  { name: 'music_note', Icon: MusicNote, label: 'Música' },

  // Tecnología
  { name: 'wifi', Icon: Wifi, label: 'Internet' },
  { name: 'phone_android', Icon: PhoneAndroid, label: 'Celular' },
  { name: 'laptop', Icon: Laptop, label: 'Computadora' },

  // Familia y Personal
  { name: 'child_care', Icon: ChildCare, label: 'Familia' },
  { name: 'favorite', Icon: Favorite, label: 'Favorito' },
  { name: 'star', Icon: Star, label: 'Estrella' },
  { name: 'pets', Icon: Pets, label: 'Mascotas' },
  { name: 'volunteer_activism', Icon: VolunteerActivism, label: 'Donación' },

  // Otros
  { name: 'work', Icon: Work, label: 'Trabajo' },
  { name: 'phone', Icon: Phone, label: 'Teléfono' },
  { name: 'build', Icon: Build, label: 'Herramienta' },
  { name: 'checkroom', Icon: Checkroom, label: 'Ropa' },
  { name: 'local_laundry_service', Icon: LocalLaundryService, label: 'Lavandería' },
]

interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
  label?: string
}

export function IconPicker({ value, onChange, label = 'Icono' }: IconPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (iconName: string) => {
    onChange(iconName)
    handleClose()
  }

  const selectedIcon = ICONS.find(i => i.name === value)

  return (
    <>
      <Box
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={{ cursor: 'pointer' }}
      >
        <TextField
          label={label}
          fullWidth
          value={value || ''}
          InputProps={{
            readOnly: true,
            startAdornment: selectedIcon ? (
              <InputAdornment position="start">
                <selectedIcon.Icon sx={{ fontSize: 20, color: 'primary.main' }} />
              </InputAdornment>
            ) : null,
            endAdornment: (
              <InputAdornment position="end">
                <ExpandMoreIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 1.5, maxHeight: 350, overflow: 'auto', width: 220 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Selecciona un icono:
          </Typography>
          <Grid container spacing={0.25} sx={{ width: '100%', margin: 0 }}>
            {ICONS.map(({ name, Icon: IconComp }) => {
              const isSelected = value === name
              return (
                <Grid item xs={2} key={name}>
                  <Box
                    onClick={() => handleSelect(name)}
                    title={name}
                    sx={{
                      p: 0.5,
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      bgcolor: isSelected ? 'primary.light' : 'transparent',
                      borderRadius: 0.5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <IconComp sx={{ fontSize: 18 }} />
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Popover>
    </>
  )
}

export function getMUIcon(iconName: string) {
  const icon = ICONS.find(i => i.name === iconName)
  return icon ? icon.Icon : null
}

export { ICONS }