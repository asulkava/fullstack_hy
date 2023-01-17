import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState("success")


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        let notificationMsg = `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(notificationMsg)
        setNotificationStyle('success')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationStyle('success')
        }, 5000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('wrong credentials')
      setNotificationStyle('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationStyle('success')
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


    
  return (
    <div> 
      {user === null ? 
        <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} style={notificationStyle} />
        <LoginForm 
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
      :
        <div>
        <h2>blogs</h2>
        <Notification message={errorMessage} style={notificationStyle} />
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        <BlogForm createBlog={addBlog}/>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        </div>
      }
    </div>
  )




}

export default App
