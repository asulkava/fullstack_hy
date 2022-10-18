var _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
  const result = blogs.reduce(function(prev, current) { return (prev.likes > current.likes) ? prev : current})
  return result
}

const mostBlogs = (blogs) => {

  let ret = {
    author: "no blogs",
    blogs: "0"
  }

  const grouped = _.groupBy(blogs, "author")
  Object.keys(grouped).forEach((key, index) => {
    const author = key
    const blogCount = grouped[key].length 
    if(blogCount > ret.blogs){
      ret = {
        author : author,
        blogs : blogCount
      }
    }
  });

  return ret;
}

const mostLikes = (blogs) => {

  let ret = {
    author: "no blogs",
    likes: "0"
  }

  const grouped = _.groupBy(blogs, "author")
  Object.keys(grouped).forEach((key, index) => {
    const author = key
    let likes = 0
    grouped[key].forEach(blog => likes += blog.likes)

    if(likes > ret.likes){
      ret = {
        author : author,
        likes : likes
      }
    }
  });

  return ret;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}