import { test, expect } from '@playwright/test'

test.describe('Pages Load', () => {
  test('Dashboard loads without error', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const hasContent = await page.locator('main, [class*="Container"]').count()
    expect(hasContent).toBeGreaterThan(0)
  })

  test('Transactions page loads', async ({ page }) => {
    await page.goto('/transactions')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h4, h5, h6').first()).toBeVisible()
  })

  test('Budget page loads', async ({ page }) => {
    await page.goto('/budget')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h4, h5, h6').first()).toBeVisible()
  })

  test('Reports page loads', async ({ page }) => {
    await page.goto('/reports')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h4, h5, h6').first()).toBeVisible()
  })

  test('Settings page loads', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h4, h5, h6').first()).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('can access dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Transaction Form', () => {
  test('form section exists', async ({ page }) => {
    await page.goto('/transactions')
    await page.waitForLoadState('networkidle')
    const formExists = await page.locator('form, [role="form"], input').count()
    expect(formExists).toBeGreaterThan(0)
  })
})

test.describe('Settings', () => {
  test('settings page has content', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    const inputs = await page.locator('input, select').count()
    expect(inputs).toBeGreaterThan(0)
  })
})