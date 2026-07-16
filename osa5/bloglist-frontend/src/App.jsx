import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
import BlogList from './components/BlogList'
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
  const [user, setUser] = useState(null)

  //const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogsAccordingToLikes(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setBlogsAccordingToLikes = blogs => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }
  const displayNotification = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      return true
    } catch {
      displayNotification('Wrong username or password', 'error')
      return false
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
    displayNotification('You have been logged out')
  }

  const createBlog = async (title, author, url) => {
    try {
      const blogObject = {
        title: title,
        author: author,
        url: url,
      }
      const response = await blogService.create(blogObject)
      const newBlogWithUser = { ...response, user }
      setBlogsAccordingToLikes(blogs.concat(newBlogWithUser))
      displayNotification(
        `A new blog "${response.title}" by ${response.author} added`,
      )
      //blogFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      displayNotification(`No blog added. ${error.message}`, 'error')
      return false
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
    setBlogsAccordingToLikes(
      blogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b)),
    )
  }

  const deleteBlog = async blogObject => {
    try {
      if (
        window.confirm(
          `Remove blog "${blogObject.title}" by ${blogObject.author}`,
        )
      ) {
        await blogService.deleteBlog(blogObject.id)
        const updatedBlogs = blogs.filter(b => b.id !== blogObject.id)
        setBlogsAccordingToLikes(updatedBlogs)
        displayNotification(
          `Blog "${blogObject.title}" by ${blogObject.author} removed`,
        )
      }
    } catch (error) {
      displayNotification(`Something went wrong. ${error.message}`, 'error')
    }
  }

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(b => b.id === match.params.id) : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
            component={Link}
            to="/"
          >
            Blog App
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={style}
          >
            Blogs
          </Button>
          {!user && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={style}
            >
              Login
            </Button>
          )}
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={style}
            >
              New blog
            </Button>
          )}
          {user && (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={style}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {notificationMessage && (
        <Notification
          message={notificationMessage}
          type={notificationType}
        />
      )}

      {user && (
        <div>
          <p>{user.name} logged in</p>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              handleLike={likeBlog}
              handleDelete={deleteBlog}
              user={user}
            />
          }
        />
        <Route
          path="/login"
          element={<LoginForm handleLogin={handleLogin} />}
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              handleLike={likeBlog}
              handleDelete={deleteBlog}
              currentUser={user}
            />
          }
        />
        <Route
          path="create"
          element={<BlogForm handleCreate={createBlog} />}
        />
      </Routes>
    </Container>
  )
}

export default App
