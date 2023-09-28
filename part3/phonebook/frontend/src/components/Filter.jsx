const Filter = (props) => {
    console.log('Filter props: ', props)
    const { text, handler } = props
    return (
        <p>Filter shown with <input value={text} onChange={handler} placeholder='Search for a person by name' /></p>
    )
}

export default Filter