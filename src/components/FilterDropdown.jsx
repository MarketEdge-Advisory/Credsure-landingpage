import React from 'react';
import '../App.css';

function FilterDropdown({ onRegionChange }) {
  const regions = ['all', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  const handleChange = (e) => {
    onRegionChange(e.target.value);
  };

  return (
    <div className="filter-dropdown">
      <select onChange={handleChange} defaultValue="all">
        <option value="all">Filter by Region</option>
        {regions.map(region => (
          <option key={region} value={region}>
            {region === 'all' ? 'All Regions' : region}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterDropdown;