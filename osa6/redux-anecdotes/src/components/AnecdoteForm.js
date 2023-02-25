import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification, closeNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AndecdoteForm = () => {

  const dispatch = useDispatch()
  
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
    dispatch(showNotification(`you created '${content}'`))
    setTimeout(() => {
        dispatch(closeNotification())
    }, 5000);
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )


}

export default AndecdoteForm