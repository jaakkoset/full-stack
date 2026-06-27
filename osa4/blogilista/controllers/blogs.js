const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.status(200).json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).end()
  }
  const user = request.user

  // Save the blog
  const newBlog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    user: user._id,
  })
  const savedBlog = await newBlog.save()
  // Add the blog id in the users `blogs` field
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user
    if (!user) {
      return response.status(400).json({ error: 'UserId missing or not valid' })
    }
    // Get the blog
    const blogId = request.params.id
    const blog = await Blog.findById(blogId)
    // Delete the blog if the request is made by the creator
    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(blogId)
      response.status(204).end()
    }
    response.status(401).end()
  },
)

blogsRouter.put('/:id', async (request, response) => {
  const likes = request.body.likes
  if (!likes) {
    return response.status(400).end()
  }

  const blogToEdit = await Blog.findById(request.params.id)
  if (!blogToEdit) {
    return response.status(404).end()
  }

  blogToEdit.likes = likes
  const updatedBlog = await blogToEdit.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter
