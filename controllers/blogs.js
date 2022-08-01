// This router is set to handle paths /api/blogs... (defined in app.js)

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


// returns all blogs in json
// All the blogs have field "user" defined in User schema which containts an id,
// which is reference to a user (to a specific User document).
// Here every blog's field user is populated with Mongoose function "populate"
// wiht the actual data from the User document (the fields username and name).
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

//returns the blog in json found with blog id
// or status code 404 "not found"
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }

})

// returns a new blog in json, the blog data has been collected from the request.
// Request body gives fields title, author, and url.
// Uses userExtractor middleware, which gives us the user from user.token
// The user is then saved as "the owner" of the blog to user field.
// If no likes is given when creating new blog, then the field likes is set to zero.
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = await request.user

  const likes = body.likes === undefined
    ? 0
    : body.likes

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// returns the updated blog in json if successful, otherwise 401 (unauthorized)
// As default the Mongoose findByIdAndUpdate function returns the document as it was before update was applied.
// Setting the option {new: true} will return the document after the update is done.
// Uses userExtractor middleware, which gives us the user from user.token
// updating cannot be done if there is no valid token in the request,
// only the owner of the blog can update the blog.
blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body
  const user = await request.user
  const blog = await Blog.findById(request.params.id)

  const dataForBlogUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  if (blog.user.toString() === user._id.toString()) {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, dataForBlogUpdate, { new: true })
    response.json(updatedBlog)
  } else {
    response.status(401).json({
      error: 'no permission'
    })
  }
})

// returns statuscode 204 (not found) if successful, otherwise 401 (unauthorized)
// uses userExtractor middleware, which gives us the user from user.token
// delete cannot be done if there is no valid token in the request,
// only the owner of the blog can delete a blog.
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = await request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({
      error: 'no permission'
    })
  }

})


module.exports = blogsRouter
