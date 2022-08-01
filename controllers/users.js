const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// This router is set for paths /api/users... (defined in app.js)
// Mongoose populate function first parameter defines a path into which documents are populated.
// All users (in our User schema) have field 'blogs' (user.blogs),
// which is an array of blogs and the ids of the blogs are stored in the array.
// In populate function the id references to Blog documents
// are replaced with the actual data from blog documents.
// By default, queries in MongoDB return all fields in matching documents,
// but we need only some of the fields, so we create a projection document.
// For every blog document the fields title, author, url and likes
// are taken and stored in the user's blogs array.
// Different paths can be used for population, but if same path is called twice
// only the last call will take effect, for example here only url and likes would be stored for blogs:
//  User
//    .populate('blogs', { title : 1, author: 1})
//    .populate('blogs', { url: 1, likes: 1 })

// returns all users in json
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  response.json(users)
})

// returns in response either populated user in json or status code 404
usersRouter.get('/:id', async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }

})

// if succesful returns status code 201 (created) and the new saved user in json
// password validations are done here (password length and existence)
// but for example name and username checks are done in mongoose User schema.
// Uses bcrypt for hashing password.
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({
      error: 'password is missing'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
