import { useState, useEffect } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { Persons } from './components/Persons'
import Notification from './components/Notification'
import personService from './services/person'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [currentFilter, setCurrentFilter] = useState('')
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState("success")


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if(persons.map(p => p.name).includes(newName)){
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        const personToUpdate =  persons.find(person => person.name === newName)
        const updatedPerson = {...personToUpdate, number : newNumber}
        personService
          .update(personToUpdate.id,updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
            setNotificationStyle("success")
            setNotificationMsg(`Changed ${newName}'s number to ${newNumber}`)
            setTimeout(() => {
              setNotificationMsg(null)
            }, 5000)
          })
          .catch(error => {
            setNotificationStyle("error")
            setNotificationMsg(
              `${error.response.data.error}`
            )
            setTimeout(() => {
              setNotificationMsg(null)
            }, 5000)
          })
        setNewName('')
        setNewNumber('')
      }
    }
    else{
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationStyle("success")
        setNotificationMsg(`Added ${personObject.name}`)
      })
      .catch(e => {
        setNotificationStyle("error")
        setNotificationMsg(`${e.response.data.error}`)
      }
        
      )
      setTimeout(() => {
        setNotificationMsg(null)
      }, 5000)
      setNewName('')
      setNewNumber('')
    }
  }

  const deletePerson = (person) => {
    if(window.confirm(`Delete ${person.name} ?`)){
      personService.deletePerson(person.id)
      setPersons(persons.filter(person1 => person1.id !== person.id))
      setNotificationStyle("success")
      setNotificationMsg(`Deleted ${person.name} from the phonebook`)
      setTimeout(() => {
        setNotificationMsg(null)
      }, 5000)
    }
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setCurrentFilter(event.target.value)
  }

  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(currentFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMsg} style={notificationStyle}/>
      <Filter value={currentFilter} onChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons persons={peopleToShow} deletePerson={deletePerson}/>
    </div>
  )

}

export default App