const Persons = (props) => {
    console.log('Persons props: ', props)
    const { persons, deleteHandler } = props

    return (
        persons.map(person =>
            <p key={person.id}>
                {person.name} {person.number}
                <button onClick={() => deleteHandler(person)}>delete</button>
            </p >
        )
    )
}

export default Persons