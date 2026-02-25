const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostBlogs } = require('../utils/list_helper')
const blogLists = require('./blog_lists')

describe('Author with most blogs', () => {
  const oneBlog = blogLists.oneBlog
  const manyBlogs = blogLists.manyBlogs

  test('is null when there are no blogs', () =>
    assert.strictEqual(mostBlogs([]), null))

  const correctOfOne = {
    author: 'Edsger W. Dijkstra',
    blogs: 1,
  }
  test('is correct with one blog', () =>
    assert.deepStrictEqual(mostBlogs(oneBlog), correctOfOne))

  const correctOfMany = {
    author: 'Robert C. Martin',
    blogs: 3,
  }
  test('is correct with many blogs', () =>
    assert.deepStrictEqual(mostBlogs(manyBlogs), correctOfMany))
})
