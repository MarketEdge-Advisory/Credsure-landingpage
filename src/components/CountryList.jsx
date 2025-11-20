import React from 'react';
import CountryCard from './CountryCard';
import '../App.css';

function CountryList({ countries }) {
  if (!countries || countries.length === 0) {
    return null;
  }

  return (
    <div className="country-list">
      {countries.map(country => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  );
}

export default CountryList;

