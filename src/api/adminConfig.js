
// Utility for admin config endpoints

export async function getAdminConfig() {
  const res = await fetch('/api/admin-config');
  if (!res.ok) throw new Error('Failed to fetch admin config');
  return res.json();
}

export async function getInterestRate() {
  const res = await fetch('/api/admin-config/interest-rate');
  if (!res.ok) throw new Error('Failed to fetch interest rate');
  return res.json();
}

export async function updateInterestRate(rate) {
  const res = await fetch('/api/admin-config/interest-rate', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rate }),
  });
  if (!res.ok) throw new Error('Failed to update interest rate');
  return res.json();
}

export async function getLoanTenures() {
  const res = await fetch('/api/admin-config/loan-tenures');
  if (!res.ok) throw new Error('Failed to fetch loan tenures');
  return res.json();
}

export async function addLoanTenure(months) {
  const res = await fetch('/api/admin-config/loan-tenures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ months }),
  });
  if (!res.ok) throw new Error('Failed to add loan tenure');
  return res.json();
}

export async function updateLoanTenure(months, data) {
  const res = await fetch(`/api/admin-config/loan-tenures/${months}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update loan tenure');
  return res.json();
}

export async function deleteLoanTenure(months) {
  const res = await fetch(`/api/admin-config/loan-tenures/${months}`, {
    method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete loan tenure');
  return res.json();
}
