import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ReportsSkeleton } from '../ReportsSkeleton'

describe('ReportsSkeleton', () => {
  it('should render skeleton cards for stats', () => {
    render(<ReportsSkeleton />)
    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render multiple stat cards', () => {
    render(<ReportsSkeleton />)
    const cards = document.querySelectorAll('.MuiCard-root')
    expect(cards.length).toBeGreaterThanOrEqual(6)
  })

  it('should render chart placeholders', () => {
    render(<ReportsSkeleton />)
    const rectSkeletons = document.querySelectorAll('.MuiSkeleton-rectangular')
    expect(rectSkeletons.length).toBeGreaterThanOrEqual(2)
  })

  it('should render without crashing', () => {
    const { container } = render(<ReportsSkeleton />)
    expect(container).toBeInTheDocument()
  })
})