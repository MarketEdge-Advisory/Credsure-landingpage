import React, { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// const SUPER_ADMIN_EMAIL = 'agency@marketedgeadvisory.com';
// const SUPER_ADMIN_PASSWORD = 'MarketEdge123';

const normalizeRole = (role) => {
  if (!role) return '';
  const normalized = String(role).toLowerCase();
  if (normalized.includes('super')) return 'super';
  if (normalized.includes('suzuki')) return 'suzuki';
  if (normalized.includes('credsure')) return 'credsure';
  return normalized;
};

// Registered admin emails. Keep in sync with the role-mapping in the login handler below.
const ADMIN_EMAILS = [
  'support@credsureloans.com',
  'suzukisalesng@cfao.com',
  'agency@marketedgeadvisory.com',
];

const isRegisteredAdmin = (email) =>
  ADMIN_EMAILS.includes(String(email || '').trim().toLowerCase());

/**
 * Hard-coded admin accounts.
 * role: 'credsure' | 'suzuki'
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });



  // LOGIN
  const login = async (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    try {
      const data = await authApi.loginAdmin({ email, password });
      // Support various backend response shapes
      let userObj = data.user || data.data?.user || data.data || data;
      let accessToken = data.accessToken || data.data?.accessToken || data.token || '';
      if (!accessToken && userObj && userObj.accessToken) accessToken = userObj.accessToken;

      const role = normalizeRole(userObj?.role);
      const userEmail = String(userObj?.email || '').toLowerCase();

      // Map correct name/initials based on email or role
      let mapped = { ...userObj };
      if (userEmail === 'support@credsureloans.com' || role === 'credsure') {
        mapped.name = 'Credsure Admin';
        mapped.initials = 'CA';
        mapped.role = 'credsure';
      } else if (userEmail === 'suzukisalesng@cfao.com' || role === 'suzuki') {
        mapped.name = 'Suzuki Admin';
        mapped.initials = 'SA';
        mapped.role = 'suzuki';
      } else if (userEmail === 'agency@marketedgeadvisory.com' || role === 'super') {
        mapped.name = 'Super Admin';
        mapped.initials = 'AM';
        mapped.role = 'super';
      } else {
        mapped.name = mapped.name || 'Admin';
        mapped.initials = mapped.initials || 'A';
      }

      if (accessToken) mapped.accessToken = accessToken;
      setUser(mapped);
      sessionStorage.setItem('admin_user', JSON.stringify(mapped));
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message || 'Invalid email or password' };
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    // Guard: backend returns 200 for any email, so validate against known admins first.
    if (!isRegisteredAdmin(email)) {
      return { ok: false, message: 'No account found with that email.' };
    }
    try {
      await authApi.forgotPassword(email);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message || 'Failed to send reset email' };
    }
  };

  // RESET PASSWORD
  const resetPassword = async ({ token, resetToken, newPassword }) => {
    try {
      await authApi.resetPassword({ resetToken: resetToken || token, newPassword });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message || 'Failed to reset password' };
    }
  };

  // GET ROLES
  const getRoles = async () => {
    try {
      const roles = await authApi.getRoles();
      return { ok: true, roles };
    } catch (e) {
      return { ok: false, message: e.message || 'Failed to get roles' };
    }
  };

  // CHANGE PASSWORD
  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message || 'Failed to change password' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, resetPassword, getRoles, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};