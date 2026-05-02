import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TransactionsSkeleton } from '../TransactionsSkeleton'

describe('TransactionsSkeleton', () => {
  it('should render skeleton table structure', () => {
    render(<TransactionsSkeleton />)
    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render table headers', () => {
    render(<TransactionsSkeleton />)
    const tableHead = document.querySelector('.MuiTableHead-root')
    expect(tableHead).toBeInTheDocument()
  })

  it('should render table body with skeleton rows', () => {
    render(<TransactionsSkeleton />)
    const tableBody = document.querySelector('.MuiTableBody-root')
    expect(tableBody).toBeInTheDocument()
  })

  it('should render without crashing', () => {
    const { container } = render(<TransactionsSkeleton />)
    expect(container).toBeInTheDocument()
  })
})