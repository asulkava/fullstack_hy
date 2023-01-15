const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')


const api = supertest(app)
let authToken = ""

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const token = await api
  .post('/api/login')
  .send({ username: 'root', password: 'sekret' })
  authToken = token.body.token

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs have field called id as identifier', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  });
})

test('a valid blog can not be added without authorization and returns 401', async () => {
  const newBlog = {
    title: "My test blog",
    author: "Test Mattinen",
    url: "www.test.com",
    likes : 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).not.toContain(
    'My test blog'
  )
})

test('a valid blog can be added with authorization ', async () => {
  const newBlog = {
    title: "My test blog",
    author: "Test Mattinen",
    url: "www.test.com",
    likes : 1
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'My test blog'
  )
})

test('if likes is not defined, the default is 0', async () => {
  const newBlog = {
    title: "My test blog 2",
    author: "Test2 Mattinen",
    url: "www.test2.com",
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authToken}`)
    .send(newBlog)
    .expect(201)

  const likes = response.body.likes
  expect(likes).toEqual(0)

})

test('a blog without title and url returns 400 ', async () => {
  const invalidBlog = {
    author: "Test Mattinen",
    likes : 1
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authToken}`)
    .send(invalidBlog)
    .expect(400)

})

test('deleting a blog succeeds with status code 204 if id and user is valid', async () => {

  // add new blog
  const newBlog = {
    title: "To delete",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  }

  const toDeleteBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authToken}`)
    .send(newBlog)
    .expect(201)

  await api
    .delete(`/api/blogs/${toDeleteBlog.body.id}`)
    .set('Authorization', `bearer ${authToken}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(toDeleteBlog.title)
})

test('updating a blog updates correctly', async () => {

  // add new blog
  const newBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  }

  const toUpdateBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${authToken}`)
    .send(newBlog)
    .expect(201)

  const blogsAtStart = await helper.blogsInDb()
  const blogsAtStartLength = blogsAtStart.length

  // update the blog
  newBlog.author = "New Author"
  newBlog.title = "New Title"

  await api
    .put(`/api/blogs/${toUpdateBlog.body.id}`)
    .send(newBlog)
    .expect(200)


  const blogsAtEnd = await helper.blogsInDb()

  // test the results
  expect(blogsAtEnd).toHaveLength(blogsAtStartLength)

  const titles = blogsAtEnd.map(r => r.title)
  const authors = blogsAtEnd.map(r => r.author)

  expect(titles).not.toContain("React patterns")
  expect(authors).not.toContain("Michael Chan")
})



afterAll(() => {
  mongoose.connection.close()
})
