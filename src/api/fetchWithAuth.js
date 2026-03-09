// Helper for fetch requests that require admin authentication.
// Automatically redirects to the admin login page when the token is invalid/expired.

export function clearAuthAndRedirect() {
  try {
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('access_token');
  } catch {
    // ignore
  }

  // Force navigation to login (replace current history entry)
  window.location.replace('/admin/login');
}

export async function authFetch(input, init = {}) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Token expired / unauthorized
    clearAuthAndRedirect();
    // Throw to stop further processing.
    throw new Error('Session expired. Redirecting to login...');
  }

  return response;
}
