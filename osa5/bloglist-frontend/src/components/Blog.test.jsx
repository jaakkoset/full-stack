import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders title and author', () => {
    const blog = {
      title: 'Blog title',
      author: 'Blog author',
      url: 'Blog url',
      likes: 0,
      user: { username: 'user1' },
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

    const element = screen.getByText('Blog title Blog author')
    expect(element).toBeVisible()
  })

  test('by default does not render url and likes', () => {
    const blog = {
      title: 'Blog title',
      author: 'Blog author',
      url: 'Blog url',
      likes: 0,
      user: { username: 'user1' },
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

    const likeElement = screen.getByText('Likes 0')
    expect(likeElement).not.toBeVisible()
    const urlElement = screen.getByText('Blog url')
    expect(urlElement).not.toBeVisible()
  })
})
