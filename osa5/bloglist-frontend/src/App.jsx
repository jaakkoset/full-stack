import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Logout from './components/Logout'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const displayNotification = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      displayNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
    displayNotification('You have been logged out')
  }

  const addBlog = async (title, author, url) => {
    try {
      const blogObject = {
        title: title,
        author: author,
        url: url,
      }
      const response = await blogService.create(blogObject)
      const newBlogWithUser = { ...response, user }
      setBlogs(blogs.concat(newBlogWithUser))
      displayNotification(
        `A new blog "${response.title}" by ${response.author} added`,
      )
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      displayNotification(`No blog added. ${error.message}`, 'error')
    }
  }

  const likeBlog = async blog => {
    const newLikes = blog.likes + 1
    const likedBlog = {
      user: blog.user.id,
      likes: newLikes,
      author: blog.author,
      url: blog.url,
    }
    const response = await blogService.update(likedBlog, blog.id)
    const updatedBlog = { ...response, user: blog.user }
    setBlogs(blogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b)))
  }

  return (
    <div>
      <h2>blogs</h2>

      {notificationMessage && (
        <Notification
          message={notificationMessage}
          type={notificationType}
        />
      )}

      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      )}

      {user && (
        <Logout
          name={user.name}
          handleClick={handleLogout}
        />
      )}

      {user && (
        <Togglable
          buttonLabel="Create a new blog"
          ref={blogFormRef}
        >
          <BlogForm handleSubmit={addBlog} />
        </Togglable>
      )}

      {user &&
        blogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={likeBlog}
          />
        ))}
    </div>
  )
}

export default App
