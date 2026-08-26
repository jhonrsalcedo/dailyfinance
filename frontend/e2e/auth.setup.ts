import { test as setup, expect } from '@playwright/test'

const TEST_USER = {
  email: 'audit.devtools@yopmail.com',
  password: 'Audit2026!',
}

const authFile = '.auth/user.json'

setup('autenticar', async ({ page }) => {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Password').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL((u) => !u.pathname.includes('login'))

  const skipBtn = page.getByRole('button', { name: /Omitir|Skip/i })
  if (await skipBtn.isVisible().catch(() => false)) {
    await skipBtn.click()
  }
  await expect(page.getByRole('heading', { name: 'Agregar Movimientos' })).toBeVisible({
    timeout: 30000,
  })

  await page.evaluate(() => {
    localStorage.setItem('language', 'es')
    localStorage.setItem('onboarding_shown', 'true')
  })
  await page.context().storageState({ path: authFile })
})
