import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AndecdoteList = () => {

  const anecdotes = useSelector(state => {
    return state.anecdotes.filter(
      anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())  
    ).sort((a,b) =>  b.votes - a.votes)
  })

  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdote(id))
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
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
 )

}

export default AndecdoteList