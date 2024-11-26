import { useState, useEffect } from 'react';
import personService from './model/person.js';
import PersonForm from './components/PersonForm.jsx';
import Filter from './components/Filter.jsx';
import Persons from './components/Persons.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const handleFilterChange = (event) => setFilter(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { name: newName, number: newNumber };

    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook, replace the old number with a new one?`
      );
      if (confirmUpdate) {
        personService
          .update(existingPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(p => (p.id !== existingPerson.id ? p : updatedPerson)));
            setMessage(`Updated ${newName}`);
            setTimeout(() => setMessage(null), 5000);
          })
          .catch(error => {
            setErrorMessage(`Error: ${error.response.data.error}`);
            setTimeout(() => setErrorMessage(null), 5000);
          });
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setMessage(`Added ${newName}`);
          setTimeout(() => setMessage(null), 5000);
        })
        .catch(error => {
          setErrorMessage(`Error: ${error.response.data.error}`);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
    setNewName('');
    setNewNumber('');
  };

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`);
    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setMessage(`Deleted ${person.name}`);
          setTimeout(() => setMessage(null), 5000);
        })
        .catch(error => {
          setErrorMessage(`Error: Could not delete ${person.name}`);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      {message && <div className="message">{message}</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
