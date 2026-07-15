import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

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

  const style = { marginBottom: 10 }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
            style={style}
          />
        </div>
        <div>
          <TextField
            label="author"
            type="text"
            value={author}
            onChange={event => setAuthor(event.target.value)}
            style={style}
          />
        </div>
        <div>
          <TextField
            label="url"
            type="text"
            value={url}
            onChange={event => setUrl(event.target.value)}
            style={style}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          style={style}
        >
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
