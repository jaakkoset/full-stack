const morgan = require('morgan')
const logger = require('./logger')

morgan.token('POST-body', request => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ' '
})

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :POST-body',
  {
    skip: () => process.env.NODE_ENV === 'test',
  },
)

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  }

  next(error)
}

module.exports = { requestLogger, errorHandler }
