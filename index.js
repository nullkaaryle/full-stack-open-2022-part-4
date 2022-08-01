// Starting the application:
// creating new Server instance that uses http
// and making it listen to the connections to the defined port.

// importing the actual application from app.js
const app = require('./app')

const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

// the app is a function that handles http requests,
// here app is given as a the requestListener parameter to createServer
const server = http.createServer(app)

// PORT is defined as environment variable in .env file
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
