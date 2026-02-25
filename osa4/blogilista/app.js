const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const { info, error } = require('./utils/logger')
const { requestLogger } = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

const app = express()

mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => info('Connected to MongoDB'))
  .catch(() => error('Connection to MongoDB failed'))

app.use(requestLogger)
app.use(express.json())
app.use('/api/blogs', notesRouter)

module.exports = app
