import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import numberService from "./services/Numbers";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(
    () => {
      numberService.getAll().then(fetchedPersons => {
        setPersons(fetchedPersons);
        setFilteredPersons(fetchedPersons);
      });
    },
    // The second argument is an empty list, because we want to trigger the effect only
    // after the first render
    [],
  );

  /** Adds a person after the user clicks the "add" button. If a person with the given name
   * already exists, asks the user whether he wants to update the number. */
  const addPerson = event => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    console.log(`Adding person "${newName}"`);
    // Check whether the person is already added to the phonebook
    const personExists = persons.find(({ name }) => name === personObject.name);
    if (personExists) {
      console.log("Person already exists:", personExists);
      // Check whether the user wants to update the number of the existing person
      if (
        window.confirm(
          `${newName} is already added to phonebook.`, //Replace the old number with the new one?
        )
      ) {
        console.log("Updating number not yet implemented");
        // // Change the number but keep the name in the database
        // const personId = personExists.id;
        // numberService
        //   .update(personId, personObject)
        //   .then(returnedPerson => {
        //     // Update the list of persons
        //     const updatedPersons = persons.map(person =>
        //       person.id !== returnedPerson.id ? person : returnedPerson,
        //     );
        //     // Update what is rendered
        //     resetApplication(updatedPersons);
        //     displayNotification(
        //       `Updated the number of ${returnedPerson.name}`,
        //       "success",
        //     );
        //   })
        //   .catch(error => {
        //     // Display error message
        //     displayNotification(
        //       `Information of ${newName} was already removed from server`,
        //       "error",
        //     );
        //     // Remove the missing person from the list of persons
        //     const updatedPersons = persons.filter(
        //       person => person.id !== personId,
        //     );
        //     resetApplication(updatedPersons);
        //   });
      } else {
        // User did not want to update the number. Do nothing.
        console.log("Number not updated");
      }
    } else {
      // Add a new person to database
      numberService.create(personObject).then(returnedPerson => {
        console.log(
          "A person added to database. Server returned this object:",
          returnedPerson,
        );
        const allPersons = returnedPerson;
        // Update what is rendered
        resetApplication(allPersons);
        // Display a success notification
        displayNotification(`Added ${personObject.name}`, "success");
      });
    }
  };

  /** Display a notification message and remove it after time out.
   * @param {string} message - The text displayed to the user.
   * @param {string} type - `success` or `error`. Determines the style of the notification.
   * @returns None
   */
  const displayNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
      setNotificationType(null);
    }, 5000);
  };

  /** Handle the event when the user types something into the name field */
  const handleNameChange = event => {
    //console.log(event.target.value);
    setNewName(event.target.value);
  };

  /** Handle the event when the user types something into the number field */
  const handleNumberChange = event => {
    //console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  /** Handle the event when the user types something into the filter field */
  const handleFilterChange = event => {
    const currentFilter = event.target.value;
    //console.log("currentFilter:", currentFilter);
    setNewFilter(currentFilter);

    filterPersons(currentFilter);
  };

  /**
   * Filters the names of persons based on `filter`, when `filter` is truthy, and
   * updates the state hook `filteredPersons`. If `filter` is falsy (an empty string),
   * includes all persons to `filteredPersons`.
   *
   * @param {string} filter - Text that user has typed into the filter text field.
   * @returns None:
   */
  const filterPersons = filter => {
    /**
     * Checks whether the filter matches a substring in a persons name.
     *
     * @returns {boolean} `True` if the lowercase name of a person includes the lowercase
     * filter and `False` otherwise.
     */
    const checkPerson = person => {
      const lowerCasePerson = person.toLowerCase();
      const lowerCaseFilter = filter.toLowerCase();
      return lowerCasePerson.includes(lowerCaseFilter);
    };

    if (filter) {
      // User has given a flter
      //console.log("Filter was truthy:", filter);
      const personsAfterFilter = persons.filter(person =>
        checkPerson(person.name),
      );
      setFilteredPersons(personsAfterFilter);
    } else {
      // Filter is an empty character. Show all persons.
      //console.log("Filter was falsy:", filter);
      setFilteredPersons(persons);
    }
  };

  /** Delete person from database */
  const removePerson = (personId, personName) => {
    console.log(`Removing person "${personName}" with id "${personId}"`);
    if (window.confirm(`Delete ${personName}?`)) {
      // User wants to delete the person
      numberService
        .remove(personId)
        .then(() => {
          const remainingPersons = persons.filter(
            person => person.id !== personId,
          );
          resetApplication(remainingPersons);
          displayNotification(`Deleted ${personName}`, "success");
        })
        .catch(error => {
          // Deletion failed. The person had probably already been deleted.
          const remainingPersons = persons.filter(
            person => person.id !== personId,
          );
          resetApplication(remainingPersons);
          displayNotification(
            `${personName} had already been deleted from the server`,
            "error",
          );
        });
    } else {
      // User does not want to delete the person. Do nothing.
      console.log("Nothing deleted");
    }
  };

  /** Resets what the user sees. Deletes text from all text fields and updates the
   * persons.
   * @param {Array} updatedListOfPersons- The is the list of persons that will be shown to the user.
   * @returns None*/
  const resetApplication = updatedListOfPersons => {
    setPersons(updatedListOfPersons);
    setFilteredPersons(updatedListOfPersons);
    setNewFilter("");
    setNewName("");
    setNewNumber("");
  };

  //console.log(persons.length, "persons");
  //console.log(filteredPersons.length, "filtered persons");
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        type={notificationType}
      />
      <Filter
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
      />
      <h2>Add a new name</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={filteredPersons}
        remove={removePerson}
      />
    </div>
  );
};

export default App;
