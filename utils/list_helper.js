const logger = require('./logger')


const dummy = (blogs) => {
  return 1
}

// function sort is stable: if the original blog list has
// for example three authors Kalle, Anna and Ville whose blogs all have 5 likes,
// then after sorting the blog list by likes,
// the order of Kalle, Anna and Ville will remain the same in the new array
const favoriteBlog = (blogs) => {
  const blogList = blogs.map(({ author, title, likes }) => ({ author, title, likes }))

  blogList.sort((a, b) => b.likes - a.likes)

  return blogs.length === 0
    ? 'no blogs'
    : blogList[0]
}


const totalLikes = (blogs) => {

  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}


const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}


const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}


module.exports = {
  favoriteBlog,
  totalLikes,
  dummy,
  reverse,
  average
}
