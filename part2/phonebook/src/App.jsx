import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (event) => {
    console.log('Name change detected: ', event.target.value)
    setNewName(event.target.value)
  }

  const handlePhoneNumberChange = (event) => {
    console.log('Number change detected: ', event.target.value)
    setNewPhone(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log('Filter change detected: ', event.target.value)
    setFilter(event.target.value)
    filteredPersons()
  }

  const filteredPersons = () => {
    return persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('handleSubmit triggered')

    const newPerson = {
      name: newName,
      number: newPhone
    }

    const nameFlag = persons.some(person => person.name === newName)
    const numberFlag = persons.some(person => person.number === newPhone)
    if (nameFlag)
      alert(`${newName} is already added to phonebook`)
    else if (numberFlag)
      alert(`Phone number ${newPhone} already exists`)
    else {
      const newArr = persons.concat(newPerson)
      setPersons(newArr)
      console.log('Persons array with updated person: ', newArr)
    }
    setNewName('')
    setNewPhone('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text={filter} handler={handleFilterChange} />

      <h2>Add new person</h2>
      <PersonForm formSubmitHandler={handleSubmit} nameState={newName} phoneState={newPhone} nameHandler={handleNameChange} phoneHandler={handlePhoneNumberChange} />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons()} />
    </div>
  )
}

export default App