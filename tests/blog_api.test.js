const supertest = require('supertest')
const mongoose = require('mongoose')
const testHelper = require('./test_helper')
const testMaterials = require('./test_materials')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testMaterials.initialBlogs)
})


describe('BLOGS ARE RETURNED CORRECTLY:', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test('unique identifier property of the blog is named id', async () => {
    const blogs = await testHelper.blogsInDb()
    const blogKeys = Object.keys(blogs[0])
    const blogIds = blogs.map(r => r.id)

    expect(blogKeys).toContain('id')
    expect(blogKeys).not.toContain('_id')
    expect(blogIds[0]).toBeDefined()
  })


  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(testMaterials.initialBlogs.length)
  })


  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(titles).toContain('Canonical string reduction')
  })

  test('returned blogs have properties title, author, url and likes', async () => {
    const blogs = await testHelper.blogsInDb()
    const blogKeys = Object.keys(blogs[0])

    expect(blogKeys).toContain('title')
    expect(blogKeys).toContain('author')
    expect(blogKeys).toContain('url')
    expect(blogKeys).toContain('likes')
  })
})

describe('VIEWING BLOGS:', () => {

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(resultBlog.body).toEqual(processedBlogToView)
  })


  test('viewing a blog fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445rairai'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })


  test('viewing blog fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await testHelper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

})


describe('ADDING BLOGS:', () => {

  test('a valid blog is added ', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testMaterials.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain('Type wars')
  })

  test('a valid blog without likes is added and has zero likes as default', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testMaterials.initialBlogs.length + 1)

    const likes = blogsAtEnd.map(r => r.likes)
    expect(likes).toContain(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testMaterials.initialBlogs.length)
  })

  test('blog without author is not added', async () => {
    const newBlog = {
      title: 'First class tests',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testMaterials.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testMaterials.initialBlogs.length)
  })

})


describe('UPDATING BLOGS:', () => {

  test('a blog can be updated', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 666
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testMaterials.initialBlogs.length)

    const likes = blogsAtEnd.map(r => r.likes)
    expect(likes).not.toContain(blogToUpdate.likes)
    expect(likes).toContain(666)
  })

})

describe('DELETING BLOGS:', () => {

  test('a blog can be deleted', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testMaterials.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

})


afterAll(() => {
  mongoose.connection.close()
})
