import { describe, it, expect } from 'vitest'
import * as TransactionFormModule from '../TransactionForm'

describe('TransactionForm', () => {
  it('should export TransactionForm component', () => {
    expect(TransactionFormModule.default).toBeDefined()
  })

  it('should be a valid React component', () => {
    const Component = TransactionFormModule.default
    expect(typeof Component).toBe('function')
  })
})