import { Link } from 'react-router-dom'
import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>Blogs</h2>
      <ul>
        {blogs.map(b => (
          <li key={b.id}>
            <Link to={`/blogs/${b.id}`}>
              {b.title} by {b.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
