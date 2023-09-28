const PersonForm = (props) => {
    console.log('PersonForm props: ', props)
    const { formSubmitHandler, nameState, phoneState, nameHandler, phoneHandler } = props
    return (
        <form onSubmit={formSubmitHandler}>
            <div>name: <input value={nameState} onChange={nameHandler} placeholder='Enter a name' /></div>
            <div>number: <input value={phoneState} onChange={phoneHandler} placeholder='Enter phone number' /></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

export default PersonForm