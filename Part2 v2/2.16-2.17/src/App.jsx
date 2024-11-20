import { useState, useEffect } from 'react';
import personService from './services/persons';
import Notification from './components/Notification';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('');

  const showNotification = (message, type) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
      setNotificationType('');
    }, 5000);
  };

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        updatePerson(existingPerson.id, updatedPerson);
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        showNotification(`Added ${newPerson.name}`, 'success');
        setNewName('');
        setNewNumber('');
      });
    }
  };

  const updatePerson = (id, updatedPerson) => {
    personService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => 
          person.id !== id ? person : returnedPerson
        ));
        showNotification(`Updated ${updatedPerson.name}'s number successfully`, 'success');
      })
      .catch(error => {
        showNotification(
          `Information of ${updatedPerson.name} has already been removed from the server`,
          'error'
        );
        setPersons(persons.filter(person => person.id !== id));
      });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id));
        showNotification(`Deleted ${name}`, 'success');
      });
    }
  };

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={filter} handleFilterChange={(e) => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
