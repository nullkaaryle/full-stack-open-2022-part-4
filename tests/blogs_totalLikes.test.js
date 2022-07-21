const listHelper = require('../utils/list_helper')
const testMaterials = require('./test_materials')


describe('TOTAL LIKES OF ALL BLOGS', () => {

  // If there are no blogs, then total likes should be zero
  test('total likes of empty blog list', () => {
    const result = listHelper.totalLikes(testMaterials.listWithoutBlogs)
    expect(result).toBe(0)
  })

  // If there is only one blog, then total likes should be that blog's likes
  test('total likes when list has only one blog', () => {
    const result = listHelper.totalLikes(testMaterials.listWithOneBlog)
    expect(result).toBe(5)
  })

  // Total likes should be the sum of all the blogs' likes
  test('total likes when list has many blogs', () => {
    const result = listHelper.totalLikes(testMaterials.listWithManyBlogs)
    expect(result).toBe(36)
  })

})
