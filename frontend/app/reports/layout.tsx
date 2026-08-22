import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reportes',
}

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
