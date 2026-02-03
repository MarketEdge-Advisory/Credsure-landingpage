import { fetchAllLocations } from '../services/api';

// Location names mapping
export const locations = ["Omole", "Gwarimpa-Abuja", "Trans Amadi Portharcourt", "Awolowo Rd 2", "Joel Ogunnaike"];

// Default/fallback location data (used when API is unavailable)
export const defaultLocationData = {
  "Omole": {
    weeklyTarget: 11773820.45,
    weeklyActual: 13539893.52,
    dailyTarget: 1681974.35,
    dailyActual: 1934270.50,
  },
  "Gwarimpa-Abuja": {
    weeklyTarget: 19984702.23,
    weeklyActual: 22982407.56,
    dailyTarget: 2854957.46,
    dailyActual: 3283201.08,
  },
  "Trans Amadi Portharcourt": {
    weeklyTarget: 5807596.42,
    weeklyActual: 6678735.88,
    dailyTarget: 829656.63,
    dailyActual: 954105.13,
  },
  "Awolowo Rd 2": {
    weeklyTarget: 7836711.12,
    weeklyActual: 9012217.79,
    dailyTarget: 1119530.16,
    dailyActual: 1287459.68,
  },
  "Joel Ogunnaike": {
    weeklyTarget: 12431848.89,
    weeklyActual: 14296626.22,
    dailyTarget: 1775978.41,
    dailyActual: 2042375.17,
  },
};

// Location data state (will be populated from API)
export let locationData = { ...defaultLocationData };

/**
 * Fetch and update location data from the API
 * Returns the fetched data or falls back to default data
 */
export const loadLocationData = async () => {
  try {
    const apiData = await fetchAllLocations();
    
    // Transform API data to match our frontend structure
    const transformedData = {};
    
    Object.keys(apiData).forEach((key) => {
      const location = apiData[key];
      // Map location names (handle case differences)
      let locationName = location.location;
      
      // Normalize location names
      if (locationName.toUpperCase() === "OMOLE") locationName = "Omole";
      if (locationName.toUpperCase() === "GWARIMPA-ABUJA") locationName = "Gwarimpa-Abuja";
      if (locationName.toUpperCase() === "TRANS AMADI PORTHARCOURT") locationName = "Trans Amadi Portharcourt";
      if (locationName.toUpperCase() === "AWOLOWO RD 2") locationName = "Awolowo Rd 2";
      if (locationName.toUpperCase() === "JOEL OGUNNAIKE") locationName = "Joel Ogunnaike";
      
      transformedData[locationName] = {
        weeklyTarget: location.weeklyTarget || 0,
        weeklyActual: location.weeklyActual || 0,
        dailyTarget: location.dailyTarget || 0,
        dailyActual: location.dailyActual || 0,
      };
    });
    
    // Update the locationData object
    locationData = { ...transformedData };
    
    return locationData;
  } catch (error) {
    console.error('Failed to load location data from API, using default data:', error);
    locationData = { ...defaultLocationData };
    return locationData;
  }
};

/**
 * Get current location data (synchronous)
 */
export const getLocationData = () => {
  return locationData;
};

// Generate trend data for each location
export const generateTrendData = (location) => {
  const data = locationData[location];
  if (!data) return [];
  
  const dailyAvg = data.weeklyActual / 7;
  const dailyTargetAvg = data.weeklyTarget / 7;
  
  return [
    { day: "Feb 1", actual: dailyAvg * 0.9, target: dailyTargetAvg * 0.85 },
    { day: "Feb 2", actual: dailyAvg * 1.1, target: dailyTargetAvg * 0.95 },
    { day: "Feb 3", actual: dailyAvg * 0.95, target: dailyTargetAvg * 0.9 },
    { day: "Feb 4", actual: dailyAvg * 0.88, target: dailyTargetAvg * 0.88 },
    { day: "Feb 5", actual: dailyAvg * 1.15, target: dailyTargetAvg * 1.05 },
    { day: "Feb 6", actual: dailyAvg * 1.05, target: dailyTargetAvg * 1.0 },
    { day: "Feb 7", actual: data.dailyActual, target: data.dailyTarget },
  ];
};

// Transaction count data (example proportions)
export const generateTransactionData = (location) => {
  const data = locationData[location];
  if (!data) return [];
  
  const avgTransactions = Math.round(data.weeklyActual / 3500);
  const avgTargetTransactions = Math.round(data.weeklyTarget / 3500);
  
  return [
    { day: "Feb 1", actual: avgTransactions * 0.9, target: avgTargetTransactions * 0.85 },
    { day: "Feb 2", actual: avgTransactions * 1.1, target: avgTargetTransactions * 0.95 },
    { day: "Feb 3", actual: avgTransactions * 0.95, target: avgTargetTransactions * 0.9 },
    { day: "Feb 4", actual: avgTransactions * 0.88, target: avgTargetTransactions * 0.88 },
    { day: "Feb 5", actual: avgTransactions * 1.15, target: avgTargetTransactions * 1.05 },
    { day: "Feb 6", actual: avgTransactions * 1.05, target: avgTargetTransactions * 1.0 },
    { day: "Feb 7", actual: Math.round(data.dailyActual / 500), target: Math.round(data.dailyTarget / 500) },
  ];
};

// Average ticket value data
export const generateAvgTicketData = (location) => {
  const data = locationData[location];
  if (!data) return [];
  
  const avgTicket = 3500;
  const avgTargetTicket = 3200;
  
  return [
    { day: "Feb 1", actual: avgTicket * 0.92, target: avgTargetTicket * 0.88 },
    { day: "Feb 2", actual: avgTicket * 1.08, target: avgTargetTicket * 0.98 },
    { day: "Feb 3", actual: avgTicket * 0.97, target: avgTargetTicket * 0.93 },
    { day: "Feb 4", actual: avgTicket * 0.90, target: avgTargetTicket * 0.90 },
    { day: "Feb 5", actual: avgTicket * 1.12, target: avgTargetTicket * 1.07 },
    { day: "Feb 6", actual: avgTicket * 1.03, target: avgTargetTicket * 1.02 },
    { day: "Feb 7", actual: avgTicket * 1.05, target: avgTargetTicket * 1.0 },
  ];
};
