import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification, closeNotification } from '../reducers/notificationReducer'


const AndecdoteList = () => {

  const anecdotes = useSelector(state => {
    return state.anecdotes.filter(
      anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())  
    ).sort((a,b) =>  b.votes - a.votes)
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(showNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => {
        dispatch(closeNotification())
    }, 5000);
  }
  
  return(      
    <div>
         {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
 )

}

export default AndecdoteList