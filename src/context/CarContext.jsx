import React, { createContext, useContext, useState } from 'react';

const CarContext = createContext();

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within CarProvider');
  }
  return context;
};

// Default starting inventory per car id (matches ChooseSuzuki car ids 1–9)
const DEFAULT_INVENTORY = {
  1: 12, // New Dzire
  2: 8,  // New Swift
  3: 15, // Alto
  4: 6,  // Grand Vitara
  5: 4,  // Jimny (5-Doors)
  6: 5,  // Grand Vitara 1.5L
  7: 10, // S-Presso
  8: 7,  // Ertiga
  9: 9,  // Celerio
};

export const CarProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);

  const selectCar = (car) => {
    setSelectedCar(car);
    const calculatorSection = document.getElementById('calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /** Add stock units to a car */
  const addStock = (carId, amount = 1) => {
    setInventory((prev) => ({ ...prev, [carId]: (prev[carId] ?? 0) + amount }));
  };

  /** Remove stock units from a car (floor at 0) */
  const removeStock = (carId, amount = 1) => {
    setInventory((prev) => ({
      ...prev,
      [carId]: Math.max(0, (prev[carId] ?? 0) - amount),
    }));
  };

  /** Set stock to an exact number */
  const setStock = (carId, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setInventory((prev) => ({ ...prev, [carId]: num }));
    }
  };

  return (
    <CarContext.Provider value={{ selectedCar, selectCar, inventory, addStock, removeStock, setStock }}>
      {children}
    </CarContext.Provider>
  );
};
