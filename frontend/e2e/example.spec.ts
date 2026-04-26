import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('shows demo mode when not authenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Modo Demo')).toBeVisible()
    await expect(page.getByText('Iniciar Sesión')).toBeVisible()
  })

  test('shows transaction form when authenticated', async () => {
    // This test requires a registered user
    // Skip for now - will be implemented with proper fixtures
    test.skip()
  })
})

test.describe('Authentication', () => {
  test('can navigate to login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Iniciar Sesión')).toBeVisible()
  })

  test('can toggle between login and register', async ({ page }) => {
    await page.goto('/login')
    await page.getByText('Regístrate').click()
    await expect(page.getByText('Crear Cuenta')).toBeVisible()
    await page.getByText('Inicia sesión').click()
    await expect(page.getByText('Iniciar Sesión')).toBeVisible()
  })
})