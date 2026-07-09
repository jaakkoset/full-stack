const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameTextbox = page.getByLabel('username')
    const passwordTextbox = page.getByLabel('password')
    const loginButton = page.getByRole('button', { name: 'login' })

    await expect(usernameTextbox).toBeVisible()
    await expect(passwordTextbox).toBeVisible()
    await expect(loginButton).toBeVisible()
  })
})
