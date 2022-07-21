// lodash is a library that has helpful functions for example array manipulation.
// Use examples:
// const newList = _(list).doSomeLodashFunction.thenAnother.andOneMore.value()
// const newList = _.doSomeLodashFunction(list)
const _ = require('lodash')


const dummy = (blogs) => {
  return 1
}


// Returns the author that has most blogs,
// and the number of blogs the author has.
// Receives a list of blogs (JSON objects) as parameter.
// First the blog list is grouped by author (author, [list of authors blogs as JSON objects])
// then every author's blogs are counted (how many JSON objects are in the author's blog list)
// then the list with authors and number of blogs is sorted by the number of blogs
// to get the author with most blogs as first we must finally reverse the list
// The _ creates a lodash object of the array given to it as parameter.
// Then functions _.groupBy, _.map, and _.reverse are used to manipulate the blogs list.
// The mapping function here is specifically the lodash map function,
// not the default array map function used for example in "favoriteBlog".
// The .value() at the end changes the lodash object back to a normal array.
const mostBlogs = (blogs) => {

  const groupByAuthorBlogs = _(blogs)
    .groupBy('author')
    .map((authorBlogList, author) => ({ author: author, blogs: authorBlogList.length }))
    .sortBy('blogs')
    .reverse()
    .value()

  return blogs.length === 0
    ? 'no blogs'
    : groupByAuthorBlogs[0]
}


// Returns the author that has most likes,
// and the number of all the likes the author has.
// Receives a list of blogs (JSON objects) as parameter.
// Uses lodash functions _.groupBy, _.map, _.reduce, _.sortBy, _.reverse.
// The .value() at the end changes the lodash object back to a normal array.
// First blogs are grouped by author.
// After that, the parameters given to lodash map function are list element and index/key,
// which are named as authorBlogList (all the blogs of one author in a list as JSON objects)
// and as author (in reality the keys in the grouped list are the author's names ).
// We only want to return author and the counted likes, other blog data is not interesting.
// Likes for one author are counted with lodash reduce function,
// which takes as parameter a collection, a reducing function, and initial value.
// Initial value is 0, and the reducer function is provided,
// the collection is always the one list element.
// See totalLikes for more comments about reduce function.
const mostLikes = (blogs) => {

  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  const groupByAuthorLikes = _(blogs)
    .groupBy('author')
    .map((authorBlogList, author) => ({ author: author, likes: _.reduce(authorBlogList, reducer, 0) }))
    .sortBy('likes')
    .reverse()
    .value()

  return blogs.length === 0
    ? 'no blogs'
    : groupByAuthorLikes[0]

}


// Returns the blog (author, title and likes) that has most likes.
// Receives a list of blogs (JSON objects) as parameter.
// Uses functions map and sort.
// Function sort is stable: if the original blog list has
// for example three authors Kalle, Anna and Ville whose blogs all have 5 likes,
// then after sorting the blog list by likes,
// the original order of Kalle, Anna and Ville will remain the same in the new array.
const favoriteBlog = (blogs) => {
  const blogList = blogs.map(({ author, title, likes }) => ({ author, title, likes }))

  blogList.sort((a, b) => b.likes - a.likes)

  return blogs.length === 0
    ? 'no blogs'
    : blogList[0]
}

// Returns the total likes of all blogs.
// Receives a list of blogs (JSON objects) as parameter.
// Uses function reduce and reducer to count the likes.
// The function reduce walks through the blogs array,
// and function reducer defines that for this element of the array (blog),
// the previous result is taken (stored in sum) and
// then this blogs' likes are added to that.
// The initial value of sum in function reduce is set to 0.
// If no initial value is given, then array[0] is used as initial value.
const totalLikes = (blogs) => {

  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}


module.exports = {
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes,
  dummy
}
