const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const { requestLogger } = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

const app = express()

mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(error => logger.error('Connection to MongoDB failed:', error.message))

app.use(requestLogger)
app.use(express.json())
app.use('/api/blogs', notesRouter)

module.exports = app
