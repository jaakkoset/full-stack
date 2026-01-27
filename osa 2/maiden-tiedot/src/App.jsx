import { useState, useEffect } from "react";
import axios from "axios";

/** Component for rendering the countries. This component either renders a list of
 * countries, information about a single country, a text indicating that no matches
 * were found, or a text indicating that more than ten matches were found.  */
const Countries = ({ listOfCountries, showOneCountry }) => {
  if (listOfCountries.length === 0) {
    return <p>No countries found.</p>;
  } else if (listOfCountries.length === 1) {
    return <CountryInfo country={listOfCountries[0]} />;
  } else if (listOfCountries.length <= 10) {
    return listOfCountries.map(c => (
      <p key={c.name}>
        {c.name} <button onClick={() => showOneCountry([c])}>Show</button>
      </p>
    ));
  }
  return <p>Too many matches. Specify another filter.</p>;
};

/** Component for rendering a single country's info */
const CountryInfo = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      Capital {country.capital}
      <br />
      Area {country.area}
      <br />
      <h2>Languages</h2>
      <ul>
        {country.languages.map(lan => (
          <li key={lan}>{lan}</li>
        ))}
      </ul>
      {
        <img
          src={country.flag}
          width="200"
        />
      }
    </div>
  );
};

const App = () => {
  const [filter, setFilter] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log("Effect. Fetching all countries...");
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        // Turn the response data into more a more concise format
        const data = response.data.map(c => {
          // Convert languages from an object to a list
          // Some areas do not have languages. Define these as empty list.
          const languages = c.languages
            ? Object.values(c.languages).map(value => value)
            : [];
          // Put all necessary info in an object
          return {
            name: c.name.common,
            capital: c.capital,
            area: c.area,
            languages: languages,
            flag: c.flags.png,
          };
        });
        console.log("Mapped data:", data);
        setCountries(data);
        setFilteredCountries(data);
      });
  }, []);

  /** Filter countries according to what the user has typed */
  const filterCountries = event => {
    const currentFilter = event.target.value;
    console.log("currentFilter:", currentFilter);
    setFilter(currentFilter);
    setFilteredCountries(
      countries.filter(country => {
        const lowerCaseCountry = country.name.toLowerCase();
        const lowerCaseFilter = currentFilter.toLowerCase();
        return lowerCaseCountry.includes(lowerCaseFilter);
      }),
    );
  };

  console.log("len filteredCountries:", filteredCountries.length);

  return (
    <div>
      <form>
        Find countries:{" "}
        <input
          value={filter}
          onChange={filterCountries}
        />
      </form>
      <Countries
        listOfCountries={filteredCountries}
        showOneCountry={setFilteredCountries}
      />
    </div>
  );
};

export default App;
