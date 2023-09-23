import { useState } from 'react'

const FeedbackButton = (props) => {
  console.log('FeedbackButton props: ', props)
  return (
    <>
      <button onClick={props.handler}>{props.text}</button>
    </>
  )

}

const Feedback = (props) => {
  console.log('Feedback props: ', props)
  return (
    <>
      <h2>give feedback</h2>
      <FeedbackButton text={props.ratings[0].rating} handler={props.ratings[0].handler} />
      <FeedbackButton text={props.ratings[1].rating} handler={props.ratings[1].handler} />
      <FeedbackButton text={props.ratings[2].rating} handler={props.ratings[2].handler} />
    </>
  )
}

const StatisticLine = (props) => {
  console.log('StatisticLine props: ', props)
  return (
    <>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </>
  )
}

const Statistics = (props) => {
  console.log('Statistics props: ', props)
  const good = props.ratings[0].value
  const neutral = props.ratings[1].value
  const bad = props.ratings[2].value
  const totalFeedback = good + neutral + bad
  const average = (totalFeedback === 0) ? 0 : ((good * 1 + neutral * 0 + bad * -1) / totalFeedback)
  const positiveFeedback = (totalFeedback === 0) ? '0%' : `${((good / totalFeedback) * 100)}%`
  if (totalFeedback === 0)
    return (<p>No feedback given</p>)
  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><StatisticLine text='good' value={good} /></tr>
          <tr><StatisticLine text='neutral' value={neutral} /></tr>
          <tr><StatisticLine text='bad' value={bad} /></tr>
          <tr><StatisticLine text='all' value={totalFeedback} /></tr>
          <tr><StatisticLine text='average' value={average} /></tr>
          <tr><StatisticLine text='positive' value={positiveFeedback} /></tr>
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClicks = () => {
    const updatedValue = good + 1
    setGood(updatedValue)
  }
  const handleNeutralClicks = () => {
    const updatedValue = neutral + 1
    setNeutral(updatedValue)
  }
  const handleBadClicks = () => {
    const updatedValue = bad + 1
    setBad(updatedValue)
  }

  const ratings = [
    {
      rating: 'good',
      value: good,
      handler: handleGoodClicks
    },
    {
      rating: 'neutral',
      value: neutral,
      handler: handleNeutralClicks
    },
    {
      rating: 'bad',
      value: bad,
      handler: handleBadClicks
    }
  ]

  return (
    <>
      <Feedback ratings={ratings} />
      <Statistics ratings={ratings} />
    </>
  )
}

export default App