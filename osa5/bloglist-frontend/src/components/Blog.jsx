import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [showAll, setShowAll] = useState(false)

  const extraInfo = { display: showAll ? '' : 'none' }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const buttonLabel = showAll ? 'Hide' : 'View'

  const showRemoveButton = {
    display: blog.user.username === currentUser.username ? '' : 'none',
  }

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
      <div style={extraInfo}>
        {blog.url}
        <br />
        Likes {blog.likes}{' '}
        <button onClick={() => handleLike(blog)}>Like</button>
        <br />
        {blog.user.name}
        <br />
        <div style={showRemoveButton}>
          <button onClick={() => handleDelete(blog)}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
