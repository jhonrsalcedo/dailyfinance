'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CategoryChartProps } from '@/models'
import { Box, Typography } from '@mui/material'

const COLORS = [
  '#1e40af',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#f97316',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { name: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          borderRadius: 2,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {payload[0].name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
          ${payload[0].value.toLocaleString('es-CO')}
        </Typography>
      </Box>
    )
  }
  return null
}

export default function CategoryChart({ data }: CategoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {data.map((_item, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="transparent"
              style={{ filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.1))' }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '0.75rem' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}