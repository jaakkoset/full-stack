const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostLikes } = require('../utils/list_helper')
const blogLists = require('./blog_lists')

describe('Author with the most likes', () => {
  const oneBlog = blogLists.oneBlog
  const manyBlogs = blogLists.manyBlogs

  const correctOne = { author: 'Edsger W. Dijkstra', totalLikes: 5 }
  test('when list has only one blog equals the likes of that', () =>
    assert.deepStrictEqual(mostLikes(oneBlog), correctOne))

  test('is null when the list is empty', () =>
    assert.strictEqual(mostLikes([]), null))

  const correctMany = { author: 'Edsger W. Dijkstra', totalLikes: 17 }
  test('of many blogs is correct', () =>
    assert.deepStrictEqual(mostLikes(manyBlogs), correctMany))
})
