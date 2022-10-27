const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

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

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "My test blog",
    author: "Test Mattinen",
    url: "www.test.com",
    likes : 1
  }

  await api
    .post('/api/blogs')
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
    .send(invalidBlog)
    .expect(400)

})

test('deleting a blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
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
