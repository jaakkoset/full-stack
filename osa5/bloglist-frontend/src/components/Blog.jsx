//import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Blog = ({ blogs, handleLike, handleDelete, currentUser }) => {
  // const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return null
  }

  // const buttonLabel = showAll ? 'Hide' : 'View'
  // const showDropdown = { display: showAll ? '' : 'none' }

  let showRemoveButton = false
  if (currentUser && blog.user.username === currentUser.username) {
    showRemoveButton = true
  }

  let showLikeButton = false
  if (currentUser) {
    showLikeButton = true
  }

  const deleteBlog = () => {
    event.preventDefault()
    handleDelete(blog)
    navigate('/')
  }

  const blogStyle = {
    paddingTop: 0,
    paddingBottom: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <h3>
        {blog.author}: {blog.title}
      </h3>
      {/* <div>
        <button onClick={() => setShowAll(!showAll)}>{buttonLabel}</button>
      </div>
      <div style={showDropdown}> */}
      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>
          Likes {blog.likes}
          {showLikeButton && (
            <button onClick={() => handleLike(blog)}>Like</button>
          )}
        </div>
        <div>added by {blog.user.name}</div>
        {showRemoveButton && (
          <div>
            <button onClick={deleteBlog}>Remove</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
