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

  test('Login link is shown', async ({ page }) => {
    const loginLink = page.getByText('Login')
    await expect(loginLink).toBeVisible()
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
      const title = 'A blog added by playwright'
      const author = 'Author-name'
      await createBlog(page, 'A blog added by playwright', 'Author-name', 'url')

      await expect(
        page.getByText(`${title} by ${author}`),
      ).toBeVisible()
    })

    test('Logout button is visible', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Logout' })

      await expect(button).toBeVisible()
    })

    describe('and a blog has been added', () => {
      const blogTitle = 'A blog added by playwright'
      const blogAuthor = 'Author-name'
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          blogTitle,
          blogAuthor,
          'url',
        )
      })

      test('user can like the blog', async ({ page }) => {
        await page.getByText(`${blogTitle} by ${blogAuthor}`).click()
        await expect(page.getByText('Likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'Like' }).click()
        await expect(page.getByText('Likes 1')).toBeVisible()
      })

      test('user can delete the blog', async ({ page }) => {
        const visibleText = `${blogTitle} by ${blogAuthor}`
        await page.getByText(visibleText).click()

        // Accept window.confirm
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'Remove' }).click()

        const message = page.getByText(
          `Blog "${blogTitle}" by ${blogAuthor} removed`,
        )
        // Notification message is visible
        await expect(message).toBeVisible()
        // No blog found anymore
        await expect(page.getByText(visibleText)).toHaveCount(0)
      })

      test('another user cannot see the remove button of the blog', async ({
        page,
        request,
      }) => {
        // Create a new user
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Pelle Peloton',
            username: 'pepe',
            password: 'salainen',
          },
        })
        const visibleText = `${blogTitle} by ${blogAuthor}`

        // Login as another user
        await page.getByRole('button', { name: 'Logout' }).click()
        await loginWith(page, 'pepe', 'salainen')
        // Navigate to the blog
        await page.getByText(visibleText).click()
        // User cannot see the "Remove" button
        await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(
          0,
        )
      })
    })
  })
})
