const morgan = require('morgan')

morgan.token('POST-body', request => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ' '
})

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :POST-body',
)

module.exports = { requestLogger }
