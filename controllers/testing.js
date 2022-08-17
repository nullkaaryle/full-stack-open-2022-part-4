const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// This router is used only for paths starting /api/testing... (defined in app.js)
// API endpoint is meant for end-to-end testing,
// and used just for emptying the testdatabase

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
