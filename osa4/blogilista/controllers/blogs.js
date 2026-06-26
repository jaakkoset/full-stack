const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }
  // Pick the first user
  const users = await User.find({})
  const user = users[0]
  const userId = user.id
  // Save the blog
  const newBlog = request.body
  newBlog['user'] = userId
  const blog = new Blog(newBlog)
  const savedBlog = await blog.save()
  // Add the blog id in the users `blogs` field
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

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
