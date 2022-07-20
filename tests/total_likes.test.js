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



