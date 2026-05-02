import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BudgetSkeleton } from '../BudgetSkeleton'

describe('BudgetSkeleton', () => {
  it('should render skeleton cards', () => {
    render(<BudgetSkeleton />)
    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render grid layout', () => {
    render(<BudgetSkeleton />)
    const cards = document.querySelectorAll('.MuiCard-root')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('should render progress bar skeletons', () => {
    render(<BudgetSkeleton />)
    const progressSkeletons = document.querySelectorAll('.MuiLinearProgress-root')
    expect(progressSkeletons.length).toBe(0)
  })

  it('should render without crashing', () => {
    const { container } = render(<BudgetSkeleton />)
    expect(container).toBeInTheDocument()
  })
})