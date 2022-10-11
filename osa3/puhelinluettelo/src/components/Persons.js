export const Persons = ({persons, deletePerson}) => {
  return(
    <ul>
      {persons.map(person => 
        <Person key={person.name} person={person} deletePerson={deletePerson} />
      )}
    </ul>
  )
}


const Person = ({person, deletePerson}) => {
  return (
    <li>{person.name} {person.number} <button onClick={() => deletePerson(person)}> delete</button> </li>
  ) 
}