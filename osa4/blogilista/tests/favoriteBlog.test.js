const { test, describe } = require('node:test')
const assert = require('node:assert')
const { favoriteBlog } = require('../utils/list_helper')
const blogLists = require('./blog_lists')

describe('most liked blog', () => {
  const oneBlog = blogLists.oneBlog
  const manyBlogs = blogLists.manyBlogs

  test('is null when there are no blogs', () =>
    assert.strictEqual(favoriteBlog([]), null))

  const correctOfOne = {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  }
  test('is correct when there is one blog', () =>
    assert.deepStrictEqual(favoriteBlog(oneBlog), correctOfOne))

  const correctOfMany = {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  }
  test('is correct when there are many blogs', () =>
    assert.deepStrictEqual(favoriteBlog(manyBlogs), correctOfMany))
})
