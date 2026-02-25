const { test, describe } = require('node:test')
const assert = require('node:assert')
const { totalLikes } = require('../utils/list_helper')
const blogLists = require('./blog_lists')

describe('total likes', () => {
  const oneBlog = blogLists.oneBlog
  const manyBlogs = blogLists.manyBlogs

  test('when list has only one blog equals the likes of that', () =>
    assert.strictEqual(totalLikes(oneBlog), 5))

  test('of empty list is zero', () => assert.strictEqual(totalLikes([]), 0))

  test('of many blogs is correct', () =>
    assert.strictEqual(totalLikes(manyBlogs), 36))
})
