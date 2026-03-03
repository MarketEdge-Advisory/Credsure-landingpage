// src/api/auth.js
// API utility functions for admin authentication and user management

const API_BASE = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/auth';

export async function loginAdmin({ email, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    let message = 'Login failed';
    try {
      const payload = await res.json();
      message = payload?.message || payload?.error || message;
    } catch {
      // Keep default message when response is not JSON
    }
    throw new Error(message);
  }
  return res.json();
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Forgot password failed');
  return res.json();
}

export async function resetPassword({ token, newPassword }) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  });
  if (!res.ok) throw new Error('Reset password failed');
  return res.json();
}

export async function getMe() {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Get user info failed');
  return res.json();
}

export async function changePassword({ oldPassword, newPassword }) {
  const user = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
  const token = user?.accessToken || '';
  const res = await fetch(`${API_BASE}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ oldPassword, newPassword })
  });
  if (!res.ok) throw new Error('Change password failed');
  return res.json();
}

export async function getRoles() {
  const res = await fetch(`${API_BASE}/roles`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Get roles failed');
  return res.json();
}

export async function createAdmin({ email, password, role }) {
  const res = await fetch(`${API_BASE}/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  if (!res.ok) throw new Error('Create admin failed');
  return res.json();
}

export async function bootstrapAdmin({ email, password }) {
  const res = await fetch(`${API_BASE}/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Bootstrap admin failed');
  return res.json();
}
