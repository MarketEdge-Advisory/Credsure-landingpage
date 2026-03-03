// Get interest rate history
export async function getInterestRateHistory() {
   const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate/history', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch interest rate history');
  return res.json();
}
// Update calculator config (downPaymentPct, processingFeePct, insuranceCost)
export async function updateCalculatorConfig({ downPaymentPct, processingFeePct, insuranceCost }) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/calculator', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ downPaymentPct, processingFeePct, insuranceCost }),
  });
  if (!res.ok) throw new Error('Failed to update calculator config');
  return res.json();
}

// Utility for admin config endpoints

export async function getAdminConfig() {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch admin config');
  return res.json();
}

export async function getInterestRate() {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch interest rate');
  return res.json();
}
export async function getPublicInterestRate() {
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate');
  if (!res.ok) throw new Error('Failed to fetch interest rate');
  return res.json();
}

export async function updateInterestRate(rate) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ annualRatePct: rate }),
  });
  if (!res.ok) throw new Error('Failed to update interest rate');
  return res.json();
}

// export async function getLoanTenures() {
//   const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
//   const token = user?.accessToken || '';
//   const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config', {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to fetch loan tenures');
//   return res.json();
// }


export async function getLoanTenures() {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const url = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config';
  
  console.log('📡 Fetching admin config from:', url);
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('📡 Response status:', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Response not OK:', res.status, errorText);
    throw new Error(`Failed to fetch admin config: ${res.status}`);
  }
  
  const response = await res.json();
  console.log('🔍 Full API response:', JSON.stringify(response, null, 2));

  // Extract loan tenures – try multiple possible paths
  let tenuresArray = [];
  
  // Common paths seen in your earlier examples
  if (response?.data?.loanTenuresInMonths) {
    tenuresArray = response.data.loanTenuresInMonths;
    console.log('✅ Found tenures in response.data.loanTenuresInMonths:', tenuresArray);
  } else if (response?.loanTenuresInMonths) {
    tenuresArray = response.loanTenuresInMonths;
    console.log('✅ Found tenures in response.loanTenuresInMonths:', tenuresArray);
  } else if (Array.isArray(response)) {
    tenuresArray = response;
    console.log('✅ Response is an array, using it directly:', tenuresArray);
  } else {
    console.warn('⚠️ No loan tenures found in response. Response structure:', response);
  }

  // If tenuresArray is empty but the request succeeded, log a warning
  if (tenuresArray.length === 0) {
    console.warn('⚠️ tenuresArray is empty. This may indicate the backend is not returning any terms, or the path is wrong.');
  }

  const tenures = tenuresArray.map(months => ({
    id: months,
    label: `${months} Months`
  }));

  return { tenures };
}

export async function addLoanTenure(months) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/loan-tenures', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ months }),
  });
  if (!res.ok) throw new Error('Failed to add loan tenure');
  return res.json();
}

export async function updateLoanTenure(months, data) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/${months}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update loan tenure');
  return res.json();
}
export async function deleteLoanTenure(months) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/loan-tenures/${months}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete loan tenure');
  return res.json();
}

// /**
//  * Fetch audit logs with pagination and optional date filtering
//  * @param {Object} params - { page, pageSize, startDate, endDate }
//  * @returns {Promise<{ items: Array, total: number }>}
//  */
// export async function getAuditLogs({ page = 1, pageSize = 10, startDate, endDate } = {}) {
//   const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
//   const token = user?.accessToken || '';
//   const params = new URLSearchParams();
//   params.append('page', page);
//   params.append('limit', pageSize);
//   if (startDate) params.append('startDate', startDate);
//   if (endDate) params.append('endDate', endDate);

//   const res = await fetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/audit-logs?${params.toString()}`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to fetch audit logs');
//   return res.json();
// }

// Add to your adminConfig.js

/**
 * Fetch activity logs with pagination and optional date filtering
 * @param {Object} params - { page, pageSize, startDate, endDate }
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getActivityLogs({ page = 1, pageSize = 10, startDate, endDate } = {}) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  
  // Build query parameters
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', pageSize);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await fetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/activity?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error('Failed to fetch activity logs');
  const response = await res.json();
  
  // The API returns { status, message, data: [...] }
  // Transform it to match our expected format { items, total }
  return {
    items: response.data || [],
    total: response.data?.length || 0 // If your API doesn't return total, we'll use client-side pagination
  };
}