import { useState, useEffect } from "react";
import axios from "axios";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [newName, setNewName] = useState("Add a new name...");
  const [newNumber, setNewNumber] = useState("Add a new number...");
  const [newFilter, setNewFilter] = useState("");

  useEffect(
    () => {
      console.log("effect");
      axios.get("http://localhost:3001/persons").then((response) => {
        console.log("Promise fulfilled. Response:", response);
        // Persons received from the database
        const receivedPersons = response.data;
        setPersons(receivedPersons);
        setFilteredPersons(receivedPersons);
      });
    },
    // The second argument is an empty list, because we want to trigger the effect only
    // after the first render
    []
  );
  console.log("render", persons.length, "persons");

  const addPerson = (event) => {
    /** Adds a person after the user clicks the "add" button. */
    event.preventDefault();
    console.log("button 'add' clicked");
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.find(({ name }) => name === personObject.name)) {
      console.log("Name found!!!");
      alert(`${newName} is already added to phonebook`);
    } else {
      axios
        .post("http://localhost:3001/persons", personObject)
        .then((response) => {
          console.log(`response: ${response}`);
        });
      setPersons(persons.concat(personObject));
      setNewName("");
      setNewNumber("");

      // Show all persons after adding a new one
      setNewFilter("");
      setFilteredPersons(persons.concat(personObject));
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
     * `filter` is falsy (empty string), sets all persons to `filteredPersons`.
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
      console.log("Filter was truthy:", filter);
      const personsAfterFilter = persons.filter((person) =>
        checkPerson(person.name)
      );
      setFilteredPersons(personsAfterFilter);
    } else {
      console.log("Filter was falsy:", filter);
      setFilteredPersons(persons);
    }
  };

  console.log("persons:", persons);
  console.log("filtered persons:", filteredPersons);
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
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;
