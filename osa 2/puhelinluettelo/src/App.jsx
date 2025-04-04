import { useState } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [newName, setNewName] = useState("Add a new name...");
  const [newNumber, setNewNumber] = useState("Add a new number...");
  const [newFilter, setNewFilter] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    //console.log("button clicked", event.target);
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.find(({ name }) => name === personObject.name)) {
      //console.log("Name found!!!");
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObject));
      setNewName("");
      setNewNumber("");

      // Show all persons after adding one
      setNewFilter("");
      setFilteredPersons(persons.concat(personObject));
    }
  };

  const handleNameChange = (event) => {
    //console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    //console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    const currentFilter = event.target.value;
    console.log("currentFilter:", currentFilter);
    setNewFilter(currentFilter);

    filterPersons(currentFilter);
  };

  const filterPersons = (filter) => {
    const checkPerson = (person) => {
      const lowerCasePerson = person.toLowerCase();
      const lowerCaseFilter = filter.toLowerCase();
      return lowerCasePerson.includes(lowerCaseFilter);
    };

    if (filter) {
      //console.log("currentFilter was truthy:", currentFilter);
      const personsAfterFilter = persons.filter((person) =>
        checkPerson(person.name)
      );
      setFilteredPersons(personsAfterFilter);
    } else {
      //console.log("currentFilter was falsy:", currentFilter);
      setFilteredPersons(persons);
    }
  };

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
