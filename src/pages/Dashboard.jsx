import React, { useState, useEffect } from 'react';
import { useCountry } from '../context/CountryContext';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import CountryList from '../components/CountryList';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../App.css';

const ITEMS_PER_PAGE = 12;

function Dashboard() {
  const { countries, loading, error } = useCountry();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    region: ''
  });
  const [filteredCountries, setFilteredCountries] = useState([]);
  
  // Filter countries 
  useEffect(() => {
    console.log('Filtering countries...', { 
      totalCountries: countries.length, 
      search: filters.search, 
      region: filters.region 
    });
    
    let result = [...countries];

    // search filter
    if (filters.search) {
      result = result.filter(country =>
        country.name.common.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // region filter
    if (filters.region && filters.region !== 'all') {
      result = result.filter(country => country.region === filters.region);
    }

    console.log('📊 Filter result:', { before: countries.length, after: result.length });
    setFilteredCountries(result);
    
    // Reset to page 1
    setCurrentPage(1);
  }, [filters.search, filters.region, countries]); 

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleRegionFilter = (region) => {
    setFilters(prev => ({ ...prev, region }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCountries = filteredCountries.slice(startIndex, endIndex);

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="dashboard">
      <div className="dashboard-controls">
        <SearchBar onSearch={handleSearch} />
        <FilterDropdown onRegionChange={handleRegionFilter} />
      </div>

      {loading && countries.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <CountryList countries={currentCountries} />
        
          {filteredCountries.length > ITEMS_PER_PAGE && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          
          {filteredCountries.length === 0 && !loading && (
            <div className="no-results">
              <p>No countries found matching your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;