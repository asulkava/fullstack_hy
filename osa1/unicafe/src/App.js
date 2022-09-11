import { useState } from 'react'

const Button = ({title, onClick}) => {
  return(
    <>
      <button onClick={onClick}>{title}</button>
    </>
  )
}

const Statistics = ({good, neutral, bad}) => {
  let all = good + neutral + bad
  let average = (good + neutral*0 + bad*(-1))/all
  let positive = good / all * 100
  if(all > 0){
    return(
      <>
        <table>
          <tbody>
            <StatisticLine text="good" value={good}/>
            <StatisticLine text="neutral" value={neutral}/>
            <StatisticLine text="bad" value={bad}/>
            <StatisticLine text="all" value={all}/>
            <StatisticLine text="average" value={average}/>
            <StatisticLine text="positive" value={positive + "%"}/>
          </tbody>
        </table>
      </>
    )
  }
  else{
    return (
      <h3>No feedback given</h3>
    )
  }

}

const StatisticLine = ({text, value}) => {
  return(
    <>
    <tr>
      <td>
        {text}
      </td>
      <td>
        {value}
      </td>
    </tr>
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)



  return (
    <div>
      <h1>give feedback</h1>
      <Button title="good" onClick={() => setGood(good + 1)}/>
      <Button title="neutral" onClick={() => setNeutral(neutral + 1)}/>
      <Button title="bad" onClick={() => setBad(bad + 1)}/>
      <h1>statistics</h1>
      <Statistics good={good}neutral={neutral}bad={bad}/>
    </div>
  )
}

export default App