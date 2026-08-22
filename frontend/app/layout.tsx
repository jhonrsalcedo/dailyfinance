import type { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: {
    default: 'Daily Finance',
    template: '%s | Daily Finance',
  },
  description:
    'Aplicación de finanzas personales para control de gastos diarios con categorías, gráficos y estadísticas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <ThemeRegistry>{children}</ThemeRegistry>
        </Providers>
      </body>
    </html>
  )
}
