import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  //initialize an array of set length and fill them with zeros at the start
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  const handleAnecdoteClick = () => {
    const newIndex = getRandomInt(0, anecdotes.length)
    console.log('New index: ', newIndex)
    setSelected(newIndex)
  }

  const handleVoteClick = () => {
    // copy the current points array to a temporary array and perform increment at desired index
    const tempPoints = [...points]
    tempPoints[selected] += 1
    setPoints(tempPoints)
    console.log('Points voted and updated: ', tempPoints)
  }

  const maxVotesIndex = () => {
    const max = Math.max(...points)
    const index = points.indexOf(max)
    console.log(`Highest vote = ${max}, first found at index = ${index}`)
    return index
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} vote{points[selected] === 1 ? '' : 's'}</p>
      <button onClick={handleVoteClick}>vote</button>
      <button onClick={handleAnecdoteClick}>next anecdote</button>

      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[maxVotesIndex()]}</p>
      <p>has {points[maxVotesIndex()]} vote{points[maxVotesIndex()] === 1 ? '' : 's'}</p>
    </div>
  )
}

export default App