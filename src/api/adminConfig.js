import { authFetch } from './fetchWithAuth';

// Get interest rate history (supports server-side pagination)
export async function getInterestRateHistory(page = 1, limit = 10) {
  const url = new URL('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate/history');
  url.searchParams.set('page', page);
  url.searchParams.set('limit', limit);

  const res = await authFetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch interest rate history');
  return res.json();
}
// Update calculator config (downPaymentPct, processingFee, insuranceCost)
export async function updateCalculatorConfig({ downPaymentPct, processingFee, insuranceCost }) {
  const payload = { downPaymentPct, processingFee, insuranceCost };
  const res = await authFetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/calculator', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage = text;
    try {
      const json = JSON.parse(text);
      errorMessage = json.message || json.error || JSON.stringify(json);
    } catch (e) {
      // not JSON
    }
    throw new Error(`Failed to update calculator config: ${errorMessage}`);
  }

  return res.json();
}

// Utility for admin config endpoints

export async function getAdminConfig() {
  const res = await authFetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config');
  if (!res.ok) throw new Error('Failed to fetch admin config');
  return res.json();
}

export async function getInterestRate() {
  const res = await authFetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate');
  if (!res.ok) throw new Error('Failed to fetch interest rate');
  return res.json();
}
export async function getPublicInterestRate() {
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate');
  if (!res.ok) throw new Error('Failed to fetch interest rate');
  return res.json();
}

export async function updateInterestRate(rate) {
  const res = await authFetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ annualRatePct: rate }),
  });
  if (!res.ok) throw new Error('Failed to update interest rate');
  return res.json();
}

export async function getLoanTenures() {
  const url = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config';

  console.log('📡 Fetching admin config from:', url);

  const res = await authFetch(url);

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
  const res = await authFetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/loan-tenures', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ months }),
  });
  if (!res.ok) throw new Error('Failed to add loan tenure');
  return res.json();
}

// export async function updateLoanTenure(months, data) {
//   const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
//   const token = user?.accessToken || '';
//   const res = await fetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/${months}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error('Failed to update loan tenure');
//   return res.json();
// }

const BASE_ADMIN_CONFIG = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config';

async function requestWithFallback(urls, options) {
  let lastError;
  for (const url of urls) {
    const res = await authFetch(url, options);
    if (res.ok) return res;
    lastError = res;
    // If the backend returns 404, try the next URL.
    if (res.status !== 404) break;
  }
  throw lastError || new Error('Request failed');
}

export async function updateLoanTenure(months, data) {
  const urls = [
    `${BASE_ADMIN_CONFIG}/${months}`,
    `${BASE_ADMIN_CONFIG}/loan-tenures/${months}`,
  ];

  const res = await requestWithFallback(urls, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Failed to update loan tenure (${res.status}: ${errorText || res.statusText})`);
  }

  return res.json();
}

export async function deleteLoanTenure(months) {
  const urls = [
    `${BASE_ADMIN_CONFIG}/${months}`,
    `${BASE_ADMIN_CONFIG}/loan-tenures/${months}`,
  ];

  const res = await requestWithFallback(urls, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Failed to delete loan tenure (${res.status}: ${errorText || res.statusText})`);
  }

  return res.json();
}

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
  // Some backends accept `page`, others accept `pageNumber`/`pageNo`, or use offset/limit.
  params.append('pageNumber', page);
  params.append('pageNo', page);
  params.append('limit', pageSize);
  params.append('pageSize', pageSize);
  params.append('offset', (page - 1) * pageSize);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await authFetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/activity?${params.toString()}`);

  if (!res.ok) throw new Error('Failed to fetch activity logs');
  const response = await res.json();
  
  // The API returns { status, message, data: [...] }
  // Sometimes the backend also sends pagination metadata.
  const items = response.data || [];
  const total = response.total ?? response.data?.total ?? response.pagination?.total ?? items.length;

  return {
    items,
    total,
  };
}

/**
 * Fetch calculator update history with pagination
 * @param {Object} params - { page, limit }
 * @returns {Promise<Object>} API response with items and pagination
 */
export async function getCalculatorHistory({ page = 1, limit = 10 }) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const params = new URLSearchParams();

  // Calculator history endpoint validates query params strictly, so only send what it supports.
  params.append('page', page);
  params.append('limit', limit);

  const res = await authFetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/calculator/history?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch calculator history');
  return res.json();
}