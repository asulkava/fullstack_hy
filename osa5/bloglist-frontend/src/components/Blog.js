import { useState } from 'react'

const Blog = ({blog, updateLikes, removeBlog, user}) => {
  
  const[showDetails, setShowDetails] = useState(false)

  return (
    <div>
      {showDetails  ?
          <div className='blog'> 
            <p>{blog.title} {blog.author}<button onClick={() => setShowDetails(false)}>hide</button></p>
            <p>{blog.url}</p>
            <p>likes {blog.likes} <button onClick={() => updateLikes(blog)}>like</button></p>
            <p>{blog.user.name}</p>
            {blog?.user.username === user.username && (
              <button onClick={() => removeBlog(blog)}>remove</button>
            )}
          </div>  
        :
          <div className='blog'> 
            {blog.title} {blog.author} <button onClick={() => setShowDetails(true)}>view</button>
          </div>  
      }
    </div>
  )
} 


export default Blog