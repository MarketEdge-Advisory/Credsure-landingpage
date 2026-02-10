const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://marketedge-server.onrender.com';

export const fetchAllLocations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/locations`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch locations');
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const fetchLocationByName = async (locationName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/locations/${encodeURIComponent(locationName)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch location');
    }
  } catch (error) {
    console.error(`Error fetching location ${locationName}:`, error);
    throw error;
  }
};

export const updateLocation = async (locationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.message || 'Failed to update location');
    }
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
