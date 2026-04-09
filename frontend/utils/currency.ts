export function formatCurrencyCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function parseCurrencyCOP(value: string): number {
  const cleaned = value.replace(/[$\s.]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}