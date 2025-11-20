
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCountry } from '../context/CountryContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../App.css';
import {  ArrowLeft } from 'lucide-react';

function CountryDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { selectedCountry, loading, error, getCountryByCode, getBorderCountries } = useCountry();
  const [borderCountries, setBorderCountries] = useState([]);
  const [loadingBorders, setLoadingBorders] = useState(false);

  useEffect(() => {
    if (code) {
      getCountryByCode(code);
    }
  }, [code, getCountryByCode]);

  useEffect(() => {
    const loadBorderCountries = async () => {
      if (selectedCountry?.borders) {
        setLoadingBorders(true);
        const borders = await getBorderCountries(selectedCountry.borders);
        setBorderCountries(borders);
        setLoadingBorders(false);
      } else {
        setBorderCountries([]);
      }
    };

    loadBorderCountries();
  }, [selectedCountry, getBorderCountries]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedCountry) return <ErrorMessage message="Country not found" />;

  const {
    name,
    flags,
    population,
    region,
    subregion,
    capital,
    tld,
    currencies,
    languages
  } = selectedCountry;

  return (
    <div className="country-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={12} color='blue'/> Back
      </button>

      <div className="country-detail-content">
        <div className="country-flag">
          <img src={flags.png} alt={`Flag of ${name.common}`} />
        </div>

        <div className="country-info">
          <h2>{name.common}</h2>
          
          <div className="info-grid">
            <div className="info-column">
              <p><strong>Native Name:</strong> {Object.values(name.nativeName || {})[0]?.common || name.common}</p>
              <p><strong>Population:</strong> {population.toLocaleString()}</p>
              <p><strong>Region:</strong> {region}</p>
              <p><strong>Sub Region:</strong> {subregion}</p>
              <p><strong>Capital:</strong> {capital?.[0] || 'N/A'}</p>
            </div>
            
            <div className="info-column">
              <p><strong>Top Level Domain:</strong> {tld?.[0] || 'N/A'}</p>
              <p><strong>Currencies:</strong> {Object.values(currencies || {}).map(curr => curr.name).join(', ') || 'N/A'}</p>
              <p><strong>Languages:</strong> {Object.values(languages || {}).join(', ') || 'N/A'}</p>
            </div>
          </div>

          <div className="border-countries">
            <strong>Border Countries:</strong>
            <div className="border-countries-list">
              {loadingBorders ? (
                <LoadingSpinner size="small" />
              ) : borderCountries.length > 0 ? (
                borderCountries.map(border => (
                  <Link
                    key={border.cca3}
                    to={`/country/${border.cca3}`}
                    className="border-country-link"
                  >
                    {border.name.common}
                  </Link>
                ))
              ) : (
                <span>No border countries</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;