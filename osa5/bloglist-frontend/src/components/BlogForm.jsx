const BlogForm = ({
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleSubmit,
}) => (
  <div>
    <h2>Create new</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={handleAuthorChange}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  </div>
)

export default BlogForm
