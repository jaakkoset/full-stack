import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  describe('When user is not logged in', () => {
    beforeEach(() => {
      const blog = {
        title: 'Blog title',
        author: 'Blog author',
        url: 'Blog url',
        likes: 0,
        user: { username: 'user1', name: 'Firstname Lastname' },
      }

      render(
        <MemoryRouter>
          <Blog
            key={1234}
            blog={blog}
            handleLike={'none'}
            handleDelete={'none'}
            currentUser={null}
          />
        </MemoryRouter>,
      )
    })

    test('renders all blog info', () => {
      const authorAndTitle = screen.getByText('Blog author: Blog title')
      const url = screen.getByText('Blog url')
      const likes = screen.getByText('Likes 0')
      const addedBy = screen.getByText('added by Firstname Lastname')
      expect(authorAndTitle).toBeVisible()
      expect(url).toBeVisible()
      expect(likes).toBeVisible()
      expect(addedBy).toBeVisible()
    })

    test('does not render like and remove buttons', () => {
      const buttons = screen.queryAllByRole('button')
      expect(buttons).toHaveLength(0)
    })
  })

  describe("When a logged in user sees someone else's blog", () => {
    beforeEach(() => {
      const blog = {
        title: 'Blog title',
        author: 'Blog author',
        url: 'Blog url',
        likes: 0,
        user: { username: 'user1', name: 'Firstname Lastname' },
      }

      const currentUser = {
        username: 'user2',
      }

      render(
        <MemoryRouter>
          <Blog
            key={1234}
            blog={blog}
            handleLike={'none'}
            handleDelete={'none'}
            currentUser={currentUser}
          />
        </MemoryRouter>,
      )
    })

    test('like button is visible', async () => {
      const button = screen.getByRole('button', { name: 'Like' })
      expect(button).toBeVisible()
    })

    test('remove button is not visible', async () => {
      const buttons = screen.queryAllByRole('button')
      expect(buttons).toHaveLength(1)
      const button = screen.queryByRole('button', { name: 'Remove' })
      expect(button).not.toBeInTheDocument()
    })
  })

  describe('When a logged in user sees his own blog', () => {
    let mockLikeHandler
    beforeEach(() => {
      const blog = {
        title: 'Blog title',
        author: 'Blog author',
        url: 'Blog url',
        likes: 0,
        user: { username: 'user1', name: 'Firstname Lastname' },
      }
      const currentUser = {
        username: 'user1',
      }
      mockLikeHandler = vi.fn()

      render(
        <MemoryRouter>
          <Blog
            key={1234}
            blog={blog}
            handleLike={mockLikeHandler}
            handleDelete={'none'}
            currentUser={currentUser}
          />
        </MemoryRouter>,
      )
    })

    test('like button is visible', async () => {
      const button = screen.getByRole('button', { name: 'Like' })
      expect(button).toBeVisible()
    })

    test('remove button is visible', async () => {
      const button = screen.queryByRole('button', { name: 'Remove' })
      expect(button).toBeVisible()
    })

    test('clikcing like twice calls handleLike twice', async () => {
      const user = userEvent.setup()
      const LikeButton = screen.getByText('Like')
      await user.click(LikeButton)
      await user.click(LikeButton)
      expect(mockLikeHandler.mock.calls).toHaveLength(2)
    })
  })
})
