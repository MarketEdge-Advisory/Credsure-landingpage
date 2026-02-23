import React, { createContext, useContext, useState } from 'react';

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

  /**
   * Attempt login. Returns { ok: true } or { ok: false, message }
   */
  const login = (email, password) => {
    const account = ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) {
      return { ok: false, message: 'Invalid email or password.' };
    }
    const { password: _pw, ...safeAccount } = account;
    setUser(safeAccount);
    sessionStorage.setItem('admin_user', JSON.stringify(safeAccount));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
