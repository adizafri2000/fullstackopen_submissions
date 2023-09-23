const Header = ({ course }) => {
  console.log(`Header: props: ${course}`)
  return (
    <>
      <h1>{course}</h1>
    </>
  )
}

const Part = ({ part }) => {
  console.log(`Part: props: ${part}`)
  return (
    <>
      <p>{part.name} {part.exercises}</p>
    </>
  )
}

const Content = ({ parts }) => {
  console.log(`Content: props: ${parts}`)
  return (
    <>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </>
  )
}

const Total = ({ parts }) => {
  console.log(`Total: props: ${parts}`)
  const tot1 = parts[0].exercises
  const tot2 = parts[1].exercises
  const tot3 = parts[2].exercises
  return (
    <>
      <p>Number of exercises {tot1 + tot2 + tot3}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App