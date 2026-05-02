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

export function formatCurrency(value: number, currency: string = 'COP'): string {
  if (currency === 'COP') {
    return formatCurrencyCOP(value)
  }
  
  const locale = currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'de-DE' : 'es-CO'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}