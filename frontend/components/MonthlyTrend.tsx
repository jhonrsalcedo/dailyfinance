'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Datos simulados para mostrar la tendencia (se obtendrían del endpoint /stats/monthly)
const mockData = [
    { name: 'Ene', Gastos: 6000000, Ingresos: 7500000 },
    { name: 'Feb', Gastos: 6500000, Ingresos: 7600000 },
    { name: 'Mar', Gastos: 7985492, Ingresos: 7878800 },
    { name: 'Abr', Gastos: 0, Ingresos: 0 },
]

export default function MonthlyTrend() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={mockData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => `$${value.toLocaleString('es-CO')}`} />
                <Legend />
                <Line type="monotone" dataKey="Gastos" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Ingresos" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    )
}