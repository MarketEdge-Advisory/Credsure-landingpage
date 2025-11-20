import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function CountryCard({ country }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  return (
    <div className="country-card" onClick={handleClick}>
      <div className="country-flag">
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      </div>
      <div className="country-info">
        <h3>{country.name.common}</h3>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
      </div>
    </div>
  );
}

export default CountryCard;