// Creating the actual application:
// taking some libraries in use,
// taking some middlewares in use,
// connecting to the database.

// config is needed to access the environment variables stored in .env
const config = require('./utils/config')

// app uses express library
// express offers an interface for using node features
const express = require('express')

// library for easier error handling
// we don't have to use try-catch blocks
require('express-async-errors')

// the app is created as an express application
const app = express()

// cors is a middleware to enable Cross-Origin Resource Sharing from different origins
// by default javascript code in browser only accepts servers in same domain.
const cors = require('cors')

// the Router objects (controllers)
// using router-level middleware enables modularity for the app.
// Every router handles it's own part of the app (requests)
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// to access misc middleware
const middleware = require('./utils/middleware')

// middleware for logging
const logger = require('./utils/logger')

// mongoose is a framework for easier MongoDb object handling
const mongoose = require('mongoose')

// connecting to the MongoDB database
// with the help of Mongoose.
// Database address is defined as environment variable in file .env
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

// When taking cors middleware in use we can have
// for example frontend in port 3000 and backend in port 3001 if needed
app.use(cors())

// app takes in use two express built-in middlewares called static and json.
// Static checks if the "build" directory contains a file corresponding to the GET request's address.
// There is no build folder (no frontend) at the moment so backend handles all.
// Json takes JSON data of the request and transforms it into a JavaScript object,
// then the object is attached to request body.
app.use(express.static('build'))
app.use(express.json())

// app takes some middleware into use.
// see utils folder for more info
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

// app takes the routers in use (also middleware).
// Routers are set to specific paths.
// Routers can be found in folder "controllers"
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// app takes some more middleware into use,
// these should be defined last
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// finally here, ready to export this app!
module.exports = app
