import React, { createContext, useContext, useState } from 'react';

const CarContext = createContext();

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within CarProvider');
  }
  return context;
};

export const CarProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);

  const selectCar = (car) => {
    setSelectedCar(car);
    // Scroll to calculator section
    const calculatorSection = document.getElementById('calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <CarContext.Provider value={{ selectedCar, selectCar }}>
      {children}
    </CarContext.Provider>
  );
};
