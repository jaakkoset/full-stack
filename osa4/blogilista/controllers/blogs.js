const jwt = require('jsonwebtoken')
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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).end()
  }
  // Check the token
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    // Is this reachable?
    return response.status(401).json({ error: 'token invalid' })
  }
  // Get the user from the database
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

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
