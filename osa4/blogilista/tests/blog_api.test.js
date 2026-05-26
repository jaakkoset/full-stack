const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

const api = supertest(app)

const initialBlogs = testHelper.manyBlogs

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
  console.log('--- response.body ---')
  console.log(response.body[0].id)
  console.log('--- END ---')
  assert.ok('id' in response.body[0], 'a blog includes an id field')
})

after(async () => {
  await mongoose.connection.close()
})
