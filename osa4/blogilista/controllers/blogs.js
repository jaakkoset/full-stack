const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
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
