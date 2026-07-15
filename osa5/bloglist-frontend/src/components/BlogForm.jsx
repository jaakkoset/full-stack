import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

  const addBlog = async () => {
    event.preventDefault()

    const success = await handleCreate(title, author, url)
    setTitle('')
    setAuthor('')
    setUrl('')
    if (success) {
      navigate('/')
    }
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={event => setAuthor(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={event => setUrl(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
