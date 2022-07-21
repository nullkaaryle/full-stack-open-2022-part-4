const listHelper = require('../utils/list_helper')
const testMaterials = require('./test_materials')


describe('THE MOST LIKED AUTHOR:', () => {

  // If there are no blogs, then there is no most liked author
  test('most liked author of empty blog list', () => {
    const result = listHelper.mostLikes(testMaterials.listWithoutBlogs)
    expect(result).toEqual('no blogs')
  })

  // If there is only one blog, then the most liked author is the only blogger
  // even if the author has no likes
  test('most liked author when list has only one blog', () => {
    const result = listHelper.mostLikes(testMaterials.listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
  })

  // If there are many authors with same total likes,
  // the mostLikes returns one of the authors
  test('most liked author when list has many blogs', () => {
    const result = listHelper.mostLikes(testMaterials.listWithManyBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })

})


describe('THE MOST PRODUCTIVE AUTHOR:', () => {

  // If there are no blogs, then there is no author that has many blogs
  test('most productive author of empty blog list', () => {
    const result = listHelper.mostBlogs(testMaterials.listWithoutBlogs)
    expect(result).toEqual('no blogs')
  })

  // If there is only one blog, then the author with most blogs is that author
  test('most productive author when list has only one blog', () => {
    const result = listHelper.mostBlogs(testMaterials.listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  // If there are many authors with same number of blogs
  // the mostBlogs returns just one of the authors
  test('most productive author when list has many blogs', () => {
    const result = listHelper.mostBlogs(testMaterials.listWithManyBlogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })

})
