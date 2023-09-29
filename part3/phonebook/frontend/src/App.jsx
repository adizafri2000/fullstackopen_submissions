import { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [messageColour, setMessageColour] = useState('green')

  const successColour = 'green'
  const failedColour = 'red'

  useEffect(() => {
    console.log('useEffect taking place')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

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

    const nameExists = persons.some(person => person.name === newName)
    if (nameExists) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const samePerson = persons.find(p => p.name === newName)
        console.log('Person to be changed: ', samePerson)
        replaceNumber(samePerson)
      }
      else
        console.log(`Skipping phone number update to ${newName}`)
    }

    else {
      const newPerson = {
        name: newName,
        number: newPhone
      }

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
      setMessageColour(successColour)
      setNotificationMessage(`Added ${newName}`)
      setTimeout(() => setNotificationMessage(null), 3000)
    }
    setNewName('')
    setNewPhone('')
  }

  const replaceNumber = targetPerson => {
    const updatedPerson = { ...targetPerson, number: newPhone }
    console.log('Updated person details: ', updatedPerson)

    personService
      .update(targetPerson.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p))
        setMessageColour(successColour)
        setNotificationMessage(`Replaced ${newName}'s phone number to ${updatedPerson.number}`)
      })
      .catch(() => {
        console.log(`Promise rejected, ${updatedPerson.name} does not exist in database records`)
        setMessageColour(failedColour)
        setNotificationMessage(`Information of ${updatedPerson.name} has already been removed from server`)
      })

    setTimeout(() => setNotificationMessage(null), 3000)
  }

  const handleDeletePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      console.log(`Will delete ${person.name} with id ${person.id}`)

      personService
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })

    }
    else
      console.log(`Will not delete ${person.name} with id ${person.id}`)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {(notificationMessage) ?
          <Notification message={notificationMessage} color={messageColour} /> :
          ''
      }

      <Filter text={filter} handler={handleFilterChange} />

      <h2>Add new person</h2>
      <PersonForm formSubmitHandler={handleSubmit} nameState={newName} phoneState={newPhone} nameHandler={handleNameChange} phoneHandler={handlePhoneNumberChange} />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons()} deleteHandler={handleDeletePerson} />
    </div>
  )
}

export default App