// Get interest rate history
export async function getInterestRateHistory() {
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate/history');
  if (!res.ok) throw new Error('Failed to fetch interest rate history');
  return res.json();
}
// Update calculator config (downPaymentPct, processingFeePct, insuranceCost)
export async function updateCalculatorConfig({ downPaymentPct, processingFeePct, insuranceCost }) {
  const token = localStorage.getItem('adminToken') || '';
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
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config');
  if (!res.ok) throw new Error('Failed to fetch admin config');
  return res.json();
}

export async function getInterestRate() {
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate');
  if (!res.ok) throw new Error('Failed to fetch interest rate');
  return res.json();
}

export async function updateInterestRate(rate) {
  const token = localStorage.getItem('adminToken') || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/interest-rate', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ rate }),
  });
  if (!res.ok) throw new Error('Failed to update interest rate');
  return res.json();
}

export async function getLoanTenures() {
  const token = localStorage.getItem('adminToken') || '';
  const res = await fetch('https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/loan-tenures', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch loan tenures');
  return res.json();
}

export async function addLoanTenure(months) {
  const token = localStorage.getItem('adminToken') || '';
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
  const token = localStorage.getItem('adminToken') || '';
  const res = await fetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/loan-tenures/${months}`, {
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
  const token = localStorage.getItem('adminToken') || '';
  const res = await fetch(`https://credsure-backend-1564d84ae428.herokuapp.com/api/admin-config/loan-tenures/${months}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete loan tenure');
  return res.json();
}
