import React, { useEffect, useState } from 'react';
import './App.css';


interface Country {
  name: string;
  region: string;
  area: number;
}

enum Sort {
  Ascending = 'ascending',
  Descending = 'descending',
}

function App() {
  const [originalCountries , setOriginalCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.Ascending);
  const [filterByArea, setFilterByArea] = useState<boolean>(false);
  const [filterByRegion, setFilterByRegion] = useState<boolean>(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v2/all?fields=name,region,area');
      const data = await response.json();
      setOriginalCountries(data);
      setCountries(data);
    } catch (error) {
      console.log('Error fetching countries:', error);
    }
  };

  const sortCountries = (order: Sort) => {
    let sortedCountries: Country[] = [...countries];

    if (order === Sort.Ascending) {
      sortedCountries.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sortedCountries.sort((a, b) => b.name.localeCompare(a.name));
    }

    setCountries(sortedCountries);
    setSortOrder(order);
  };

  const filterCountries = () => {
    let filteredCountries: Country[] = [...countries];

    if (filterByArea) {
      // @ts-ignore
      filteredCountries = filteredCountries.filter((country) => country.area < countries.find((c) => c.name === 'Lithuania')?.area);
    }

    if (filterByRegion) {
      filteredCountries = filteredCountries.filter((country) => country.region === 'Oceania');
    }

    setCountries(filteredCountries);
  };

  const resetFilters = () => {
    setCountries(originalCountries);
    setFilterByArea(false);
    setFilterByRegion(false);
  };

  return (
      <div className="container">
        <h1>Country Visualization</h1>

        <div className="filters-container">
          <div className="filter-box">
            <label>
              Filter by Area Size:
              <input type="checkbox" checked={filterByArea} onChange={() => setFilterByArea(!filterByArea)} />
            </label>
            <label>
              Filter by Region:
              <input type="checkbox" checked={filterByRegion} onChange={() => setFilterByRegion(!filterByRegion)} />
            </label>
            <label>
            Sort by Name:{' '}
            <select value={sortOrder} onChange={(e) => sortCountries(e.target.value as Sort)}>
              <option value={Sort.Ascending}>Ascending</option>
              <option value={Sort.Descending}>Descending</option>
            </select>
          </label>
          </div>
          <div className="button-container">
            <button className="button" onClick={filterCountries}>Apply Filters</button>
            <button className="button" onClick={resetFilters}>Reset Filters</button>
          </div>

        </div>

        <div className="country-container">
          {countries.map((country, index) => (
              <div key={index} className="country-box">
                <h2>{country.name}</h2>
                <p>
                  <strong>Region: </strong>
                  {country.region}
                </p>
                <p>
                  <strong>Area (sq. km): </strong>
                  {country.area}
                </p>
              </div>
          ))}
        </div>
      </div>
  );

}

export default App;
