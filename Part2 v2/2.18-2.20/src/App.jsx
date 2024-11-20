import { useState, useEffect } from "react";
import axios from "axios";
import CountryDetail from './components/CountryDetail.jsx';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital[0];
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
        })
        .catch((error) => console.error("Error fetching weather:", error));
    }
  }, [selectedCountry, weatherApiKey]);

  const handleFilterChange = (event) => setFilter(event.target.value);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  const handleShowCountry = (country) => setSelectedCountry(country);

  return (
    <div>
      <h1>Find Countries</h1>
      <input value={filter} onChange={handleFilterChange} />

      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        filteredCountries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleShowCountry(country)}>Show</button>
          </div>
        ))
      ) : filteredCountries.length === 1 ? (
        <CountryDetail country={filteredCountries[0]} weather={weather} />
      ) : (
        <p>No matches found</p>
      )}

      {selectedCountry && filteredCountries.length > 1 && (
        <CountryDetail country={selectedCountry} weather={weather} />
      )}
    </div>
  );
};

export default App;
