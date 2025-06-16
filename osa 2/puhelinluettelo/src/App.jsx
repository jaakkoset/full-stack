import { useState, useEffect } from "react";
import axios from "axios";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import numberService from "./services/Numbers";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(
    () => {
      numberService.getAll().then((fetchedPersons) => {
        setPersons(fetchedPersons);
        setFilteredPersons(fetchedPersons);
      });
    },
    // The second argument is an empty list, because we want to trigger the effect only
    // after the first render
    []
  );

  const addPerson = (event) => {
    /** Adds a person after the user clicks the "add" button. If a person with the given name
     * already exists, asks the user whether he wants to update the number. */
    event.preventDefault();
    console.log("button 'add' clicked");
    const personObject = {
      name: newName,
      number: newNumber,
    };

    // Check whether the person is already added to the phonebook
    const personExists = persons.find(({ name }) => name === personObject.name);
    console.log("personExists", personExists);
    if (personExists) {
      console.log("Name found!!!");
      // Check whether the user wants to update the number of the existing person
      if (
        window.confirm(
          `${newName} is already added to phonebook. Replace the old number with the new one?`
        )
      ) {
        console.log("update number");
        // Change the number but keep the name in the database
        const personId = personExists.id;
        numberService.update(personId, personObject).then((returnedPerson) => {
          // Update the list of persons
          const updatedPersons = persons.map((person) =>
            person.id !== returnedPerson.id ? person : returnedPerson
          );
          // Update what is rendered
          setPersons(updatedPersons);
          setFilteredPersons(updatedPersons);
        });
      } else {
        console.log("Number not updated");
      }
    } else {
      numberService.create(personObject).then((returnedPerson) => {
        console.log(
          "A person added to database. Returned person object:",
          returnedPerson
        );
        const allPersons = persons.concat(returnedPerson);
        setPersons(allPersons);
        setNewName("");
        setNewNumber("");
        // Show all persons after adding a new one
        setNewFilter("");
        setFilteredPersons(allPersons);
      });
    }
  };

  const handleNameChange = (event) => {
    /** Handle the event when the user types something into the name field */
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    /** Handle the event when the user types something into the number field */
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    /** Handle the event when the user types something into the filter field */
    const currentFilter = event.target.value;
    console.log("currentFilter:", currentFilter);
    setNewFilter(currentFilter);

    filterPersons(currentFilter);
  };

  const filterPersons = (filter) => {
    /**
     * Filters the names of persons based on `filter`, when `filter` is truthy, and sets
     * the `filteredPersons` using the `setFilteredPersons` functions. If
     * `filter` is falsy (empty string), sets `filteredPersons` to be all persons.
     *
     * Returns:
     *  None
     */
    const checkPerson = (person) => {
      /**
       * Checks whether the filter matches a substring in a perons name.
       *
       * Return:
       *  bool:
       *    true: if the lowercase name of a person includes the lowercase filter.
       *    false: otherwise.
       */
      const lowerCasePerson = person.toLowerCase();
      const lowerCaseFilter = filter.toLowerCase();
      return lowerCasePerson.includes(lowerCaseFilter);
    };

    if (filter) {
      // User has given a flter
      console.log("Filter was truthy:", filter);
      const personsAfterFilter = persons.filter((person) =>
        checkPerson(person.name)
      );
      setFilteredPersons(personsAfterFilter);
    } else {
      // Filter is an empty character. Show all persons.
      console.log("Filter was falsy:", filter);
      setFilteredPersons(persons);
    }
  };

  const removePerson = (personId, personName) => {
    /** Delete person from database */
    if (window.confirm(`Delete ${personName}?`)) {
      numberService.remove(personId).then((removedPerson) => {
        console.log("Person removed", removedPerson);
        const remainingPersons = persons.filter(
          (person) => person.id !== removedPerson.id
        );
        setPersons(remainingPersons);
        setFilteredPersons(remainingPersons);
      });
    } else {
      console.log("Nothing deleted");
    }
  };

  console.log(persons.length, "persons");
  console.log(filteredPersons.length, "filtered persons");
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>Add a new name</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} remove={removePerson} />
    </div>
  );
};

export default App;
