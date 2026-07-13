import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [showAll, setShowAll] = useState(false)

  const showDropdown = { display: showAll ? '' : 'none' }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const buttonLabel = showAll ? 'Hide' : 'View'

  let style = 'none'
  if (currentUser && blog.user.username === currentUser.username) {
    style = ''
  }
  const showRemoveButton = { display: style }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleShowAll}>{buttonLabel}</button>
      </div>
      <div style={showDropdown}>
        <div>{blog.url}</div>
        <div>
          Likes {blog.likes}
          <button onClick={() => handleLike(blog)}>Like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={showRemoveButton}>
          <button onClick={() => handleDelete(blog)}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
