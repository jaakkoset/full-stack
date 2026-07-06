import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls the callback hander with the correct info after clicking create', async () => {
    const createBlog = vi.fn()
    const newBlog = {
      title: 'Blog title',
      author: 'Blog author',
      url: 'Blog url',
    }
    render(<BlogForm handleSubmit={createBlog} />)

    const user = userEvent.setup()

    const titleField = screen.getByLabelText('title')
    const authorField = screen.getByLabelText('author')
    const urlField = screen.getByLabelText('url')
    const sendButton = screen.getByText('create')

    await user.type(titleField, newBlog.title)
    await user.type(authorField, newBlog.author)
    await user.type(urlField, newBlog.url)
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toBe(newBlog.title)
    expect(createBlog.mock.calls[0][1]).toBe(newBlog.author)
    expect(createBlog.mock.calls[0][2]).toBe(newBlog.url)
  })
})
