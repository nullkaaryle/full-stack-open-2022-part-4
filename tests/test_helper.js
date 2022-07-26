const Blog = require('../models/blog')
const User = require('../models/user')


const nonExistingId = async () => {
  const blog = new Blog({
    title: 'title-soon-to-be-removed',
    author: 'author-soon-to-be-removed',
    url: 'url-soon-to-be-removed',
    likes: 666
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb
}
