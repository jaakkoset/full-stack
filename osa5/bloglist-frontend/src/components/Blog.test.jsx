import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
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

    render(
      <Blog
        key={1234}
        blog={blog}
        handleLike={'none'}
        handleDelete={'none'}
        currentUser={currentUser}
      />,
    )
  })

  test('renders title and author', () => {
    const element = screen.getByText('Blog title Blog author')
    expect(element).toBeVisible()
  })

  test('by default does not render url and likes', () => {
    const likeElement = screen.getByText('Likes 0')
    expect(likeElement).not.toBeVisible()
    const urlElement = screen.getByText('Blog url')
    expect(urlElement).not.toBeVisible()
  })

  test('renders ulr, likes and user after pressing View button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const likeElement = screen.getByText('Likes 0')
    expect(likeElement).toBeVisible()
    const urlElement = screen.getByText('Blog url')
    expect(urlElement).toBeVisible()
    const userElement = screen.getByText('Firstname Lastname')
    expect(userElement).toBeVisible()
  })
})

describe('Clikcing', () => {
  test('Like twice calls handleLike twice', async () => {
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
    const mockLikeHandler = vi.fn()

    render(
      <Blog
        key={1234}
        blog={blog}
        handleLike={mockLikeHandler}
        handleDelete={'none'}
        currentUser={currentUser}
      />,
    )

    const user = userEvent.setup()
    const LikeButton = screen.getByText('Like')
    await user.click(LikeButton)
    await user.click(LikeButton)
    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
