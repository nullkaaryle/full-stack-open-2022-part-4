// This file handles environment variables
// PORT for server
// MONGODB_URI for database connection
// SECRET for digital token signing
// Different variables are given when tests are run

require('dotenv').config()

let PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.NODE_ENV === 'test'
  ? process.env.TEST_SECRET
  : process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}
