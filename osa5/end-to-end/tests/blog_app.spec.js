const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorMessage = page.getByText('Wrong username or password')
      await expect(errorMessage).toBeVisible()
      await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'A blog added by playwright', 'Author-name', 'url')

      await expect(
        page.getByText('A blog added by playwright Author-name'),
      ).toBeVisible()
    })

    describe('and a blog has been added', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'A blog added by playwright',
          'Author-name',
          'url',
        )
      })

      test.only('user can like the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'View' }).click()
        await expect(page.getByText('Likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'Like' }).click()
        await expect(page.getByText('Likes 1')).toBeVisible()
      })
    })
  })
})
