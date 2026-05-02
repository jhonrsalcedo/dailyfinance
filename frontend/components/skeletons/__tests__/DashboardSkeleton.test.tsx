import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DashboardSkeleton } from '../DashboardSkeleton'

describe('DashboardSkeleton', () => {
  it('should render skeleton cards for stats', () => {
    render(<DashboardSkeleton />)
    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render multiple grid items', () => {
    render(<DashboardSkeleton />)
    const cards = document.querySelectorAll('.MuiCard-root')
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })

  it('should render without crashing', () => {
    const { container } = render(<DashboardSkeleton />)
    expect(container).toBeInTheDocument()
  })
})