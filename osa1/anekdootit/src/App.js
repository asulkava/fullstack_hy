import { useState } from 'react'


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Button = ({title, onClick}) => {
  return(
    <>
      <button onClick={onClick}>{title}</button>
    </>
  )
}

const Header = ({header}) => {
  return(
    <>
      <h1>{header}</h1>
    </>
  )
}

const Anecdote = ({anecdote, votes}) => {
  return(
    <>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </>
  )
}


const App = () => {
  
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))


  const bestAnecdote = () => {
    const max = Math.max(...points);
    const index = points.indexOf(max);
    return index
  }

  const updateVotes = (current) => {
    const copy = [...points]
    copy[current] += 1
    setPoints(copy) 
  }

  return (
    <div>
      <Header header="Anecdote of the day"/>
      <Anecdote anecdote={anecdotes[selected]} votes={points[selected]}/>
      <div>
        <Button title="vote" onClick={() => updateVotes(selected)}/>
        <Button title="next anecdote" onClick={() => setSelected(getRandomInt(anecdotes.length))}/>
      </div>
      <Header header="Anecdote with most votes"/>
      <Anecdote anecdote={anecdotes[bestAnecdote()]} votes={points[bestAnecdote()]}/>
    </div>
  )
}

export default App