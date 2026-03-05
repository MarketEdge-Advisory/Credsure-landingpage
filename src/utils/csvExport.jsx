// utils/csvExport.js

/**
 * Converts an array of objects to a CSV string with proper UTF-8 BOM.
 * @param {Array} data - Array of row objects.
 * @param {Array} headers - Array of header strings (order matters).
 * @returns {string} CSV content with BOM.
 */
export function convertToCSV(data, headers) {
  // Map each row to an array of values in the same order as headers
  const rows = data.map(row =>
    headers.map(header => {
      // Access the property; adjust if your row structure differs
      const value = row[header] || '';
      // Escape double quotes and wrap in quotes if necessary
      return `"${String(value).replace(/"/g, '""')}"`;
    })
  );

  // Build CSV string: headers + rows
  const csvContent = [
    headers.map(h => `"${h}"`).join(','), // quoted headers
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Prepend UTF-8 BOM for Excel compatibility
  return '\uFEFF' + csvContent;
}

/**
 * Triggers a browser download of a CSV file.
 * @param {string} csvContent - CSV content (with BOM already added).
 * @param {string} filename - Name of the file to download.
 */
export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}