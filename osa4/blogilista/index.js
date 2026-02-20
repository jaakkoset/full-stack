require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

morgan.token('POST-body', request => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ' '
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :POST-body',
  ),
)

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const MONGODB_URI = process.env.MONGODB_URI
mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => console.log('Connected to MongoDB'))

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
