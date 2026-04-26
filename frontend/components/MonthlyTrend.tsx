'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Box, Typography, useTheme } from '@mui/material'

const mockData = [
  { name: 'Ene', Gastos: 6000000, Ingresos: 7500000 },
  { name: 'Feb', Gastos: 6500000, Ingresos: 7600000 },
  { name: 'Mar', Gastos: 7985492, Ingresos: 7878800 },
  { name: 'Abr', Gastos: 0, Ingresos: 0 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: entry.color,
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {entry.name}:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
              ${entry.value.toLocaleString('es-CO')}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }
  return null
}

export default function MonthlyTrend() {
  const theme = useTheme()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={mockData}
        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          axisLine={{ stroke: theme.palette.divider }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          axisLine={{ stroke: theme.palette.divider }}
          tickLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: 20 }}
        />
        <Line
          type="monotone"
          dataKey="Gastos"
          stroke={theme.palette.error.main}
          strokeWidth={2.5}
          dot={{ fill: theme.palette.error.main, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: theme.palette.error.main, strokeWidth: 2, fill: '#fff' }}
          animationDuration={800}
          animationEasing="ease-out"
        />
        <Line
          type="monotone"
          dataKey="Ingresos"
          stroke={theme.palette.success.main}
          strokeWidth={2.5}
          dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: theme.palette.success.main, strokeWidth: 2, fill: '#fff' }}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}