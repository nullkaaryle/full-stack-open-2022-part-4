const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Router for login is used for paths /api/login... (defined in app.js)
// Uses bcrypt library to hash passwords, returns a true or false (or error).
// Uses jwt library for creating JSON Web Tokens.
// Tokens are used in authorization header (Authorization: Bearer <token>).
// Bearer is the name of authentication schema.
// The token is signed with payload and a secret key.
// The default algorithm is HS256.
// The payload (public claim) is some JSON data, here we give a object (the userForToken)
// The secret key is set in .env file.
// Token is set to expire in an hour, tokens include iat ("issued at" timestamp) as default.

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

  response
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name
    })
})

module.exports = loginRouter
