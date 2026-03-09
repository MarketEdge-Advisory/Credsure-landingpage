// src/api/auth.js
// API utility functions for admin authentication and user management

import { authFetch } from './fetchWithAuth';

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

async function parseErrorResponse(res, defaultMessage) {
  let message = defaultMessage;
  try {
    const payload = await res.json();
    if (payload) {
      // Prefer explicit errors array when available (e.g., validation failures)
      if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        // Avoid displaying raw backend validation details in the UI.
        message = 'Validation failed. Please check your input and try again.';
      } else if (typeof payload.errors === 'string' && payload.errors.trim()) {
        message = payload.errors;
      } else {
        message =
          payload?.message ||
          payload?.error ||
          payload?.data?.message ||
          payload?.data?.error ||
          message;
      }
    }
  } catch {
    // ignore invalid json
  }
  return message;
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const payload = await res.json().catch(() => null);

  // Backend may return 200 even when the email is not registered.
  // Detect failure explicitly and throw so callers can handle it.
  const messageCandidate =
    payload?.message ||
    payload?.error ||
    payload?.data?.message ||
    payload?.data?.error ||
    '';

  const negativity = /not\s*found|no\s*user|invalid\s*email|doesn\'t\s*exist|not\s*registered|user\s*does\s*not\s*exist|does\s*not\s*exist/i;

  const isFail =
    !res.ok ||
    payload == null ||
    payload.status === false ||
    payload.ok === false ||
    payload.success === false ||
    (typeof messageCandidate === 'string' && negativity.test(messageCandidate));

  if (isFail) {
    const message =
      (typeof messageCandidate === 'string' && messageCandidate.trim())
        ? messageCandidate
        : 'Email not registered. Please check and try again.';
    throw new Error(message);
  }

  return payload;
}

export async function resetPassword({ resetToken, token, newPassword }) {
  const payload = { newPassword };
  if (resetToken) payload.resetToken = resetToken;
  if (token) payload.resetToken = token;

  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await parseErrorResponse(res, 'Failed to reset password. Please try again.');
    throw new Error(message);
  }
  return res.json();
}

export async function getMe() {
  const res = await authFetch(`${API_BASE}/me`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Get user info failed');
  return res.json();
}

export async function changePassword({ oldPassword: currentPassword, newPassword }) {
  // Validate inputs
  if (!currentPassword?.trim()) throw new Error('Current password is required');
  if (!newPassword?.trim()) throw new Error('New password is required');

  const res = await authFetch(`${API_BASE}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      currentPassword,      // ✅ renamed from oldPassword
      newPassword 
    }),
  });

  // Improved error handling
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Change password failed');
  }
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

export async function verifyOtp({ code }) {
  const res = await fetch(`${API_BASE}/verify-reset-password-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const message = await parseErrorResponse(res, 'Invalid or expired code. Please try again.');
    throw new Error(message);
  }
  return res.json();
}
