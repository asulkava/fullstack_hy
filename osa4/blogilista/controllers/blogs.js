const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({})
  .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // checks if middleware returns token and user
  if(!request.token || !request.token.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (!request.user) {
    return response.status(401).json({ error: 'user not found' })
  }

  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {

  // check if blog exists
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog with this id could not be found' })
  }
  
  // checks if middleware returns token and user
  if(!request.token || !request.token.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (!request.user) {
    return response.status(401).json({ error: 'user not found' })
  }

  // check that the blog that is being deleted is the users own blog
  const user = request.user

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'Wrong user' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter