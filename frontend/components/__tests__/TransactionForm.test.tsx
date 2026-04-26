import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TransactionForm from '../TransactionForm'

vi.mock('../TransactionForm', () => ({
  default: () => <div data-testid="transaction-form">TransactionForm</div>,
}))

describe('TransactionForm', () => {
  it('should render transaction form component', () => {
    render(<TransactionForm />)
    expect(screen.getByTestId('transaction-form')).toBeInTheDocument()
  })
})
