import { test, expect } from '@playwright/test'

const unique = Date.now()
const description = `E2E flujo critico ${unique}`

test.describe('Autenticación', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('login con credenciales inválidas muestra error', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.getByLabel('Email').fill('audit.devtools@yopmail.com')
    await page.getByLabel('Password').fill('WrongPassword123!')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.locator('[role="alert"]').last()).toBeVisible()
  })
})

test.describe('Transacciones: flujo CRUD', () => {
  test('crear transacción desde dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Agregar Movimientos' })).toBeVisible({
      timeout: 30000,
    })

    const monto = page.getByLabel('Monto')
    await monto.click()
    await monto.pressSequentially('15000')
    await expect(monto).toHaveValue('$ 15.000')

    await page.getByLabel('Categoría').click()
    await page.getByRole('option', { name: 'Transporte' }).click()

    await page.getByLabel('Método').click()
    await page.getByRole('option', { name: 'Efectivo' }).click()

    await page.getByLabel('Descripción').fill(description)
    await page.getByRole('button', { name: 'Agregar' }).click()

    await expect(page.getByText('Transacción registrada')).toBeVisible({ timeout: 15000 })
  })

  test('transacción creada aparece en el listado', async ({ page }) => {
    await page.goto('/transactions')
    await expect(page.getByRole('heading', { name: 'Transacciones' })).toBeVisible({
      timeout: 30000,
    })

    await page.getByLabel('Buscar transacciones').fill(description)
    await expect(page.getByText(description)).toBeVisible()
    await expect(page.getByText('$ 15.000').first()).toBeVisible()
  })

  test('eliminar transacción con diálogo de confirmación', async ({ page }) => {
    await page.goto('/transactions')
    await expect(page.getByRole('heading', { name: 'Transacciones' })).toBeVisible({
      timeout: 30000,
    })

    await page.getByLabel('Buscar transacciones').fill(description)
    await page.getByRole('button', { name: `Eliminar ${description}` }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page.getByText(description)).toBeVisible()

    await page.getByRole('button', { name: `Eliminar ${description}` }).click()
    await dialog.getByRole('button', { name: 'Eliminar' }).click()
    await expect(page.getByText(description)).not.toBeVisible({ timeout: 15000 })
  })
})

test.describe('Presupuesto: crear y eliminar', () => {
  test('crear límite de presupuesto', async ({ page }) => {
    await page.goto('/budget')
    await expect(page.getByRole('heading', { name: 'Presupuesto' })).toBeVisible({
      timeout: 30000,
    })

    await page.getByRole('button', { name: 'Agregar' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.getByRole('combobox', { name: /Categoría/ }).click()
    await page.getByRole('option', { name: 'Salud' }).click()

    const limite = dialog.getByLabel('Límite')
    await limite.click()
    await limite.pressSequentially('200000')
    await expect(limite).toHaveValue('$ 200.000')

    await dialog.getByRole('button', { name: 'Guardar' }).click()
    await expect(dialog).not.toBeVisible({ timeout: 15000 })
    await expect(page.getByText('$ 200.000').first()).toBeVisible()
  })

  test('eliminar límite de presupuesto', async ({ page }) => {
    await page.goto('/budget')
    await expect(page.getByRole('heading', { name: 'Presupuesto' })).toBeVisible({
      timeout: 30000,
    })

    const row = page.getByRole('row', { name: /Salud/ })
    await row.getByRole('button').last().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Eliminar' }).click()
    await expect(page.getByRole('row', { name: /Salud/ })).not.toBeVisible({ timeout: 15000 })
  })
})

test.describe('Configuración: salario', () => {
  test('guardar salario muestra confirmación', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: 'Configuración' })).toBeVisible({
      timeout: 30000,
    })

    const salario = page.getByLabel('Salario Mensual')
    await expect(salario).toBeVisible()

    await salario.click()
    await salario.pressSequentially('5700000')
    await page.getByRole('button', { name: 'Guardar Cambios' }).click()

    await expect(page.getByText(/guardado correctamente/i)).toBeVisible({ timeout: 15000 })
  })
})
