import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1231244" },
  ]);
  const [newName, setNewName] = useState("Add a new name...");
  const [newNumber, setNewNumber] = useState("Add a new number...");

  const addPerson = (event) => {
    event.preventDefault();
    //console.log("button clicked", event.target);
    const personObject = {
      name: newName,
      number: newNumber,
    };

    // console.log("name:", personObject.name);
    // console.log(
    //   "Is added:",
    //   persons.find(({ name }) => name === personObject.name)
    // );

    if (persons.find(({ name }) => name === personObject.name)) {
      //console.log("Name found!!!");
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObject));
      setNewName("");
      setNewNumber("");
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

  //console.log("persons", persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          <div>
            number: <input value={newNumber} onChange={handleNumberChange} />
          </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map((person) => (
          <p key={person.name}>
            {person.name} {person.number}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
