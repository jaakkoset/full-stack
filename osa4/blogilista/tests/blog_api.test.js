const bcrypt = require('bcrypt')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testHelper = require('./test_helper')

const api = supertest(app)

const initialBlogs = testHelper.manyBlogs

const getToken = async (username = 'user1', password = 'sekret') => {
  /* Gets the token of the user */
  const response = await api.post('/api/login').send({ username, password })
  return response.body.token
}

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

  test('updating the number of likes succeeds', async () => {
    const blogsBefore = await testHelper.blogsInDb()
    const blogToUpdate = blogsBefore[0]
    const requestBody = { likes: 50 }
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(requestBody).expect(200)

    const blogsAfter = await testHelper.blogsInDb()
    const updatedBlog = blogsAfter.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, requestBody.likes)
  })
})

describe('When there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'user1',
      name: 'Pelle Peloton',
      passwordHash,
    })

    await user.save()
  })

  describe('adding a user', () => {
    test('succeeds with a new username', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const newUser = {
        username: 'Kaapo69',
        name: 'Kaapo Kirjailija',
        password: 'paprika123',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await testHelper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('fails with proper statuscode and message if username is already taken', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const newUser = {
        username: 'user1',
        name: 'Pete Peltonen',
        password: 'paprika123',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('expected `username` to be unique'))

      const usersAtEnd = await testHelper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with proper statuscode and message if there is no username', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const newUser = {
        username: '',
        name: 'Pelle Papa',
        password: 'password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('username required'))

      const usersAtEnd = await testHelper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with proper statuscode and message if username is too short', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const newUser = {
        username: '12',
        name: 'Pelle Papa',
        password: 'password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes(
          'username must be at least 3 characters long',
        ),
      )

      const usersAtEnd = await testHelper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with proper statuscode and message if there is no password', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const newUser = {
        username: 'Papi',
        name: 'Pelle Papa',
        password: '',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('password required'))

      const usersAtEnd = await testHelper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with proper statuscode and message if password is too short', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const newUser = {
        username: 'Papi',
        name: 'Pelle Papa',
        password: '12',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes(
          'password must be at least 3 characters long',
        ),
      )

      const usersAtEnd = await testHelper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  describe('adding a blog', () => {
    test('succeeds with valid inputs', async () => {
      // Get the token
      const token = await getToken()

      // Create blog content
      const blogTitle = 'A new blog'
      const blog = {
        title: blogTitle,
        author: 'Edsger W. Dijkstra',
        url: 'http://www.helsinki.fi/blogs/a_new_blog',
      }

      // Add the new blog
      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
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
      const token = await getToken()
      const blogTitle = 'This blog has no likes'
      const blog = {
        title: blogTitle,
        author: 'Ben Blogger',
        url: 'https://parhaat-blogit.fi/092834',
      }
      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
      let addedBlog = await testHelper.getBlogs()
      addedBlog = addedBlog.find(b => b.title === blogTitle)
      assert.strictEqual(addedBlog['likes'], 0)
    })

    test('fails with a proper status code and message without a token', async () => {
      const blog = {
        title: 'A new blog',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.helsinki.fi/blogs/a_new_blog',
      }
      const result = await api
        .post('/api/blogs')
        .send(blog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('token missing or invalid'))
    })

    test('fails with a proper status code and message with an invalid token', async () => {
      const blog = {
        title: 'A new blog',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.helsinki.fi/blogs/a_new_blog',
      }
      let token = await getToken()
      // Break the token
      token = 'oops' + token.slice(4)
      const result = await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('token missing or invalid'))
    })
  })

  describe('When some blogs and two users are initially in the db', () => {
    beforeEach(async () => {
      // Save the users
      const initialUsers = [
        {
          username: 'user1',
          name: 'Pelle Peloton',
          passwordHash: await bcrypt.hash('sekret', 10),
        },
        {
          username: 'user2',
          name: 'Aku Ankka',
          passwordHash2: await bcrypt.hash('sekret2', 10),
        },
      ]
      await User.deleteMany({})
      const savedUsers = await User.insertMany(initialUsers)
      // Save the id of the first user
      const userId = savedUsers[0]._id.toString()
      // Add the first user as a creator for the blogs
      const blogsWithCreator = initialBlogs.map(blog => {
        return { ...blog, user: userId }
      })
      // Save the blogs
      await Blog.deleteMany({})
      await Blog.insertMany(blogsWithCreator)
    })

    describe('deleting a blog', () => {
      test('using a valid id and token succeeds', async () => {
        const token = await getToken('user1', 'sekret')

        const blogsBefore = await testHelper.blogsInDb()
        const blogToDelete = blogsBefore[0]

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204)

        const blogsAfter = await testHelper.blogsInDb()
        const blogIds = blogsAfter.map(b => b.id)
        assert(!blogIds.includes(blogToDelete.id))
        assert.strictEqual(blogsAfter.length, blogsBefore.length - 1)
      })

      test('without a token fails with a proper status code and message', async () => {
        const blogsBefore = await testHelper.blogsInDb()
        const blogToDelete = blogsBefore[0]

        const result = await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
        assert(result.body.error.includes('token missing or invalid'))

        const blogsAfter = await testHelper.blogsInDb()
        const blogIds = blogsAfter.map(b => b.id)
        assert(blogIds.includes(blogToDelete.id))
        assert.strictEqual(blogsAfter.length, blogsBefore.length)
      })

      test('using a wrong token fails with a proper status code and message', async () => {
        // Get the token of a wrong user
        const token = await getToken('user2', 'sekret')

        const blogsBefore = await testHelper.blogsInDb()
        const blogToDelete = blogsBefore[0]

        const result = await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
        assert(result.body.error.includes('token missing or invalid'))

        const blogsAfter = await testHelper.blogsInDb()
        const blogIds = blogsAfter.map(b => b.id)
        assert(blogIds.includes(blogToDelete.id))
        assert.strictEqual(blogsAfter.length, blogsBefore.length)
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
