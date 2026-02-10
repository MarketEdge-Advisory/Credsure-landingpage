/**
 * Format currency with Nigerian Naira symbol
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '₦0.00';
  
  return `₦${value.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

/**
 * Format currency in millions (for charts)
 * @param {number} value - The value to format
 * @returns {string} Formatted string in millions
 */
export const formatCurrencyMillions = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '₦0M';
  return `₦${(value / 1_000_000).toFixed(1)}M`;
};

/**
 * Format percentage
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with thousand separators
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  return value.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
