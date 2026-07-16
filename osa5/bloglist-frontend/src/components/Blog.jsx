import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  let showRemoveButton = false
  if (currentUser && blog.user.username === currentUser.username) {
    showRemoveButton = true
  }

  let showLikeButton = false
  if (currentUser) {
    showLikeButton = true
  }

  const deleteBlog = async event => {
    event.preventDefault()
    if (await handleDelete(blog)) {
      navigate('/')
    }
  }

  return (
    <div className="blog">
      <h3 className="title">{blog.title}</h3>
      <div className="author">by {blog.author}</div>
      <div>
        <a
          href={blog.url}
          className="link"
        >
          {blog.url}
        </a>

        <div className="info-row">added by {blog.user.name}</div>
        <div className="info-row">
          <span style={{ fontWeight: '900', fontSize: '1.01rem' }}>
            Likes {blog.likes}
          </span>
          {showLikeButton && (
            <button
              className="like-button"
              onClick={() => handleLike(blog)}
            >
              Like
            </button>
          )}
          {showRemoveButton && (
            <button
              className="remove-button"
              onClick={deleteBlog}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
