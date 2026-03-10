import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import * as authApi from '../api/auth';

const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const normalizeRole = (role) => {
  if (!role) return '';
  const normalized = String(role).toLowerCase();
  if (normalized.includes('super')) return 'super';
  if (normalized.includes('suzuki')) return 'suzuki';
  if (normalized.includes('credsure')) return 'credsure';
  return normalized;
};

// Derive display name and initials purely from the role returned by the backend
const mapUserFromRole = (userObj) => {
  const role = normalizeRole(userObj?.role);
  const mapped = { ...userObj, role };
  if (role === 'credsure') {
    mapped.name = mapped.name || 'Credsure Admin';
    mapped.initials = mapped.initials || 'CA';
  } else if (role === 'suzuki') {
    mapped.name = mapped.name || 'Suzuki Admin';
    mapped.initials = mapped.initials || 'SA';
  } else if (role === 'super') {
    mapped.name = mapped.name || 'Super Admin';
    mapped.initials = mapped.initials || 'SA';
  } else {
    mapped.name = mapped.name || 'Admin';
    mapped.initials = mapped.initials || 'A';
  }
  return mapped;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const inactivityTimerRef = useRef(null);

  const doLogout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('access_token');
  }, []);

  // Reset the inactivity timer on any user activity
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      doLogout();
      // Show a non-blocking alert (works without SweetAlert dependency)
      window.alert('You have been logged out due to 1 hour of inactivity.');
    }, INACTIVITY_TIMEOUT_MS);
  }, [doLogout]);

  // Attach/detach activity listeners whenever a user is logged in
  useEffect(() => {
    if (!user) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer, { passive: true }));
    resetInactivityTimer(); // start the timer immediately on login

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [user, resetInactivityTimer]);

  // LOGIN
  const login = async (email, password) => {
    try {
      const data = await authApi.loginAdmin({ email, password });
      // Support various backend response shapes
      let userObj = data.user || data.data?.user || data.data || data;
      let accessToken = data.accessToken || data.data?.accessToken || data.token || '';
      if (!accessToken && userObj && userObj.accessToken) accessToken = userObj.accessToken;

      const mapped = mapUserFromRole(userObj);
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
    doLogout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, resetPassword, getRoles, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};