const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const testHelper = require('./test_helper')
const testMaterials = require('./test_materials')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    passwordHash
  })

  await user.save()
})


describe('USER CREATION: USERNAME TESTS', () => {



  test('user creation succeeds with a fresh username', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'test-username',
      name: 'Test User',
      password: 'very-secret-123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails if username already taken', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'rootbeer',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)


    const validationErrorMessage = 'Error, expected `username` to be unique.'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails if username is too short', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'us',
      name: 'Shorty Shortpants',
      password: 'short123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'User validation failed: username: Path `username` (`us`) is shorter than the minimum allowed length (3).'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails if username is not given', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      name: 'Shorty Shortpants',
      password: 'short123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'User validation failed: username: Path `username` is required.'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })


})



describe('USER CREATION: PASSWORD TESTS', () => {

  test('user creation fails if password is too short', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'public',
      name: 'Phoebe Plum',
      password: 'sh'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'password must be at least 3 characters long'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails if password is not given', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'public',
      name: 'Phoebe Plum'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'password is missing'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })


})
