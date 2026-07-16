const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByText('Login').click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
}

const createBlog = async (page, title, author, url) => {
  await page.getByText('New blog').click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title} by ${author}`).waitFor()
}

export { loginWith, createBlog }
