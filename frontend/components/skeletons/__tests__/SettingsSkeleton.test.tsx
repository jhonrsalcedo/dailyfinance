import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SettingsSkeleton } from '../SettingsSkeleton'

describe('SettingsSkeleton', () => {
  it('should render skeleton form sections', () => {
    render(<SettingsSkeleton />)
    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render multiple cards for settings sections', () => {
    render(<SettingsSkeleton />)
    const cards = document.querySelectorAll('.MuiCard-root')
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('should render input field skeletons', () => {
    render(<SettingsSkeleton />)
    const textFieldSkeletons = document.querySelectorAll('.MuiSkeleton-text')
    expect(textFieldSkeletons.length).toBeGreaterThan(0)
  })

  it('should render without crashing', () => {
    const { container } = render(<SettingsSkeleton />)
    expect(container).toBeInTheDocument()
  })
})