import React, { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

/**
 * Hard-coded admin accounts.
 * role: 'credsure' | 'suzuki'
 */
const ACCOUNTS = [
  {
    email: 'credsure@admin.com',
    password: 'Credsure@2026',
    role: 'credsure',
    name: 'Credsure Admin',
    initials: 'CA',
  },
  {
    email: 'suzuki@admin.com',
    password: 'Suzuki@2026',
    role: 'suzuki',
    name: 'Suzuki Admin',
    initials: 'SA',
  },
];

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
    try {
      const data = await authApi.loginAdmin({ email, password });
      setUser(data.user || data); // adjust if backend returns user in data.user
      sessionStorage.setItem('admin_user', JSON.stringify(data.user || data));
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message || 'Login failed' };
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    try {
      await authApi.forgotPassword(email);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message || 'Failed to send reset email' };
    }
  };

  // RESET PASSWORD
  const resetPassword = async ({ token, newPassword }) => {
    try {
      await authApi.resetPassword({ token, newPassword });
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, resetPassword, getRoles, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
