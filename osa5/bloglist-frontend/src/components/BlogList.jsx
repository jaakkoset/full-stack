import Blog from './Blog'

const BlogList = ({ blogs, handleLike, handleDelete, user }) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(b => (
        <Blog
          key={b.id}
          blog={b}
          handleLike={handleLike}
          handleDelete={handleDelete}
          currentUser={user}
        />
      ))}
    </div>
  )
}

export default BlogList
