const listHelper = require('../utils/list_helper')
const testMaterials = require('./test_materials')

describe('TOTAL LIKES:', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(testMaterials.listWithoutBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(testMaterials.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testMaterials.listWithManyBlogs)
    expect(result).toBe(36)
  })

})

describe('FAVORITES:', () => {

  test('favorite blog of empty blog list', () => {
    const result = listHelper.favoriteBlog(testMaterials.listWithoutBlogs)
    expect(result).toEqual('no blogs')
  })

  test('favorite blog when list has only one blog', () => {
    const result = listHelper.favoriteBlog(testMaterials.listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  // if there are many favorite blogs,
  // the favoriteBlog function returns the favorite blog
  // which was the first in the order original list
  test('favorite blog when list has many blogs', () => {
    const result = listHelper.favoriteBlog(testMaterials.listWithManyBlogs)
    expect(result).toEqual((
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    ))
  })

})
