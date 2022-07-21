const listHelper = require('../utils/list_helper')
const testMaterials = require('./test_materials')


describe('THE FAVORITE BLOG WITH MOST LIKES:', () => {

  // If there are no blogs, then there is no favorite blog
  test('favorite blog of empty blog list', () => {
    const result = listHelper.favoriteBlog(testMaterials.listWithoutBlogs)
    expect(result).toEqual('no blogs')
  })

  // If there is only one blog, then the favorite blog is that one
  // even if the blog has no likes.
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
  // which was the first in the order of the original list
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
