const Header = (props) => {
    console.log('Header props: ', props)
    const { course } = props
    return (
        <h1>{course}</h1>
    )
}

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => {
    console.log('Part part props: ', part)
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}

const Content = ({ parts }) => {
    console.log('Content parts props: ', parts)
    return (
        <>
            {parts.map(part =>
                <Part key={part.id} part={part} />
            )}
        </>
    )
}

const Course = (props) => {
    console.log('Course props: ', props)
    const { course, parts } = props
    const total = parts.reduce((accumulator, part) => {
        return accumulator + part.exercises
    }, 0)
    console.log('Total: ', total)

    return (
        <>
            <Header course={course} />
            <Content parts={parts} />
            <Total sum={total} />
        </>
    )

}

export default Course