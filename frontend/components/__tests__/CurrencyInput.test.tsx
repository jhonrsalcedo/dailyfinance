import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CurrencyInput from '../CurrencyInput'

describe('CurrencyInput', () => {
  it('renders with label associated to input', () => {
    render(<CurrencyInput label="Monto" onValueChange={() => {}} />)
    expect(screen.getByLabelText(/monto/i)).toBeDefined()
  })

  it('formats typed value with COP thousand separators', () => {
    const handleValueChange = vi.fn()
    render(<CurrencyInput label="Monto" onValueChange={handleValueChange} />)
    const input = screen.getByLabelText(/monto/i) as HTMLInputElement

    fireEvent.change(input, { target: { value: '5700000' } })

    expect(input.value).toBe('$ 5.700.000')
    expect(handleValueChange.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({ floatValue: 5700000 })
      )
  })

  it('formats partial values while typing', () => {
    const handleValueChange = vi.fn()
    render(<CurrencyInput label="Monto" onValueChange={handleValueChange} />)
    const input = screen.getByLabelText(/monto/i) as HTMLInputElement

    fireEvent.change(input, { target: { value: '32500' } })

    expect(input.value).toBe('$ 32.500')
    expect(handleValueChange.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({ floatValue: 32500 })
      )
  })

  it('emits undefined floatValue when emptied', () => {
    const handleValueChange = vi.fn()
    render(
      <CurrencyInput label="Monto" onValueChange={handleValueChange} value={5700000} />
    )
    const input = screen.getByLabelText(/monto/i) as HTMLInputElement

    fireEvent.change(input, { target: { value: '' } })

    expect(input.value).toBe('')
    expect(handleValueChange.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({ floatValue: undefined })
      )
  })

  it('does not allow negative values', () => {
    const handleValueChange = vi.fn()
    render(<CurrencyInput label="Monto" onValueChange={handleValueChange} />)
    const input = screen.getByLabelText(/monto/i) as HTMLInputElement

    fireEvent.change(input, { target: { value: '-500' } })

    expect(input.value).not.toContain('-')
  })
})
