import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showAll, setShowAll] = useState(false)

  const extraInfo = { display: showAll ? '' : 'none' }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const buttonLabel = showAll ? 'Hide' : 'View'

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
        <button onClick={() => console.log(`Liked "${blog.title}"`)}>
          Like
        </button>
        <br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog
