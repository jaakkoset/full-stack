const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

const api = supertest(app)

const initialBlogs = testHelper.manyBlogs

describe('When some blogs are initially saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('returned blogs include an id field', async () => {
    const response = await api.get('/api/blogs')
    assert.ok('id' in response.body[0], 'a blog includes an id field')
  })

  describe('adding a blog', () => {
    test('succeeds with valid inputs', async () => {
      const blogTitle = 'A new blog'
      const blog = {
        title: blogTitle,
        author: 'Edsger W. Dijkstra',
        url: 'http://www.helsinki.fi/blogs/a_new_blog',
        likes: 11,
      }

      // Add a new blog
      await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Check that the number of blogs has increased by one
      const blogs = await testHelper.getBlogs()
      assert.strictEqual(blogs.length, initialBlogs.length + 1)

      // Check that the added title is in the database
      const addedBlog = blogs.find(b => b.title === blogTitle)
      assert.strictEqual(addedBlog['title'], blogTitle)
    })

    test('is done by default with zero likes', async () => {
      const blogTitle = 'This blog has no likes'
      const blog = {
        title: blogTitle,
        author: 'Ben Blogger',
        url: 'https://parhaat-blogit.fi/092834',
      }
      await api.post('/api/blogs').send(blog)
      let addedBlog = await testHelper.getBlogs()
      addedBlog = addedBlog.find(b => b.title === blogTitle)
      assert.strictEqual(addedBlog['likes'], 0)
    })

    test('without a title returns status 400', async () => {
      const blog = {
        author: 'Ben Blogger',
        url: 'https://parhaat-blogit.fi/209833',
      }
      await api.post('/api/blogs').send(blog).expect(400)
      const blogs = await testHelper.getBlogs()
      assert.strictEqual(blogs.length, initialBlogs.length)
    })

    test('without an url returns status 400', async () => {
      const blog = {
        author: 'Ben Blogger',
        title: 'No URL',
      }
      await api.post('/api/blogs').send(blog).expect(400)
      const blogs = await testHelper.getBlogs()
      assert.strictEqual(blogs.length, initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
