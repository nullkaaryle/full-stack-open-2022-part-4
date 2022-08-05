const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Middlewares can be used to handle request and response objects.
// next() function in a middleware gives control to the next middleware.
// (Middlewares are defined in app.js in specific order)


// Logs request info.
// Uses logger to log to console.
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('Authorization header:  ', request.headers.authorization)
  logger.info('---')
  next()
}


// Finds out the user from the request token
// and then adds it in to the request as "user"
const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  request.user = User.findById(decodedToken.id)
  next()
}

// Extracts the token from the authorization header
// and then adds it to the request as "token"
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  request.token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

// If user ends up to address not defined
// and gets 404 statuscode in response.
const unknownEndpoint = (request, response, next) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

// Middleware for checking specific errors
// and adding error messages for them.
// Error handling middleware always takes four arguments.
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  logger.error(error.message)
  next(error)
}


module.exports = {
  requestLogger,
  userExtractor,
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}
