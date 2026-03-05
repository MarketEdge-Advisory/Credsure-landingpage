import React, { useState, useEffect } from 'react';
import { changePassword } from '../../api/auth';
import { Eye, EyeOff, Monitor, MoreVertical } from 'lucide-react';
import Swal from 'sweetalert2';

// Helper to retrieve token from various storage locations
const getToken = () => {
  let token = localStorage.getItem('adminToken') || '';
  if (!token) {
    try {
      const user = JSON.parse(sessionStorage.getItem('admin_user'));
      token = user?.accessToken || user?.data?.accessToken || '';
    } catch {}
  }
  return token;
};

const ProfileSettings = () => {
  // ─── State ───────────────────────────────────────────────
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);         // confirm
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ─── Helper: Fetch Sessions ──────────────────────────────
  const fetchSessions = async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const token = getToken();
      const res = await fetch(
        'https://credsure-backend-1564d84ae428.herokuapp.com/api/auth/me',
        {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data.sessions || data.devices || []);
    } catch (e) {
      setSessionsError(e.message || 'Failed to fetch sessions');
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // ─── Validation ──────────────────────────────────────────
  const validateForm = () => {
    const errors = {};

    if (!currentPassword.trim())
      errors.currentPassword = 'Current password is required.';
    if (!newPassword.trim())
      errors.newPassword = 'New password is required.';
    if (!confirmPassword.trim())
      errors.confirmPassword = 'Please confirm your new password.';

    // Password strength validation
if (newPassword && newPassword.length < 8) {
  errors.newPassword = 'Password must be at least 8 characters long.';
} else if (newPassword && !/(?=.*[A-Z])/.test(newPassword)) {
  errors.newPassword = 'Password must contain at least one uppercase letter.';
} else if (newPassword && !/(?=.*\d)/.test(newPassword)) {
  errors.newPassword = 'Password must contain at least one number.';
} else if (newPassword && !/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newPassword)) {
  errors.newPassword = 'Password must contain at least one special character.';
}

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = 'New passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Submit Handler ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setError();
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form.',
        confirmButtonColor:'#2e9fe6',
      });
      setLoading(false);
      return;
    }

    try {
      // Map oldPassword → currentPassword for the API
      await changePassword({
        oldPassword: currentPassword,   // will be renamed inside changePassword
        newPassword,
      });

      setSuccess();
      Swal.fire({
        icon: 'success',
        title: 'Password Changed!',
        text: 'Your password has been updated successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFieldErrors({});
    } catch (e) {
      setError();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: e.message || 'Failed to change password',
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Toggle handlers (simple) ────────────────────────────
  const toggleCurrent = () => setShowPasswordCurrent(!showPasswordCurrent);
  const toggleNew = () => setShowPasswordNew(!showPasswordNew);
  const toggleConfirm = () => setShowPassword(!showPassword);

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="p-8 w-full">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Set and modify your password settings.
      </p>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Password Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div>
            <p className="font-semibold text-gray-900">Change Password</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Please enter your current password to change your password.
            </p>
          </div>

          {/* Desktop Save button */}
          <div className="hidden md:flex flex-col items-end gap-2">
            <button
              type="submit"
              form="passwordForm"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Details'}
            </button>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
          </div>
        </div>

        {/* Form */}
        <form
          id="passwordForm"
          className="grid grid-cols-1 gap-4 pb-8 border-b border-gray-100 md:grid-cols-[200px_1fr] md:gap-8"
          onSubmit={handleSubmit}
        >
          <p className="text-sm font-medium text-gray-700 pt-2">
            Input password details
          </p>

          <div className="flex flex-col gap-4">
            {/* Current Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type={showPasswordCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
                }}
                className={`w-full border ${
                  fieldErrors.currentPassword ? 'border-red-500' : 'border-gray-200'
                } rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-blue-400`}
              />
              <span
                className="absolute inset-y-0 right-3 top-8 flex items-center cursor-pointer text-gray-500"
                onClick={toggleCurrent}
              >
                {showPasswordCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
              {fieldErrors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type={showPasswordNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                className={`w-full border ${
                  fieldErrors.newPassword ? 'border-red-500' : 'border-gray-200'
                } rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-blue-400`}
              />
              <span
                className="absolute inset-y-0 right-3 top-0 flex items-center cursor-pointer text-gray-500"
                onClick={toggleNew}
              >
                {showPasswordNew ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
              {fieldErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.newPassword}</p>
              )}
              {/* Password requirements hint */}
              <p className="text-xs text-gray-400 mt-1">
                Password must be at least 8 characters, contain at least one uppercase letter, one number and one special character.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                className={`w-full border ${
                  fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                } rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-blue-400`}
              />
              <span
                className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer text-gray-500"
                onClick={toggleConfirm}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Mobile Save Button */}
            <button
              type="submit"
              className="block md:hidden w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Details'}
            </button>

            {/* Mobile Messages */}
            <div className="block md:hidden">
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
            </div>
          </div>
        </form>

        {/* Where you're logged in */}
        <div className="pt-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              {/* <p className="font-semibold text-gray-900">Where you're logged in</p> */}
              <p className="text-sm text-gray-400 mt-0.5">
                We'll alert you via{' '}
                <span className="text-blue-500">cresdsuresuzuki@gmail.com</span>{' '}
                if there is any unusual activity on your account.
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
              {/* <MoreVertical size={18} /> */}
            </button>
          </div>

          {/* <div className="mt-5 flex flex-col divide-y divide-gray-100">
            {sessionsLoading ? (
              <div className="py-4 text-gray-400 text-sm">Loading sessions...</div>
            ) : sessionsError ? (
              <div className="py-4 text-red-500 text-sm">{sessionsError}</div>
            ) : sessions.length === 0 ? (
              <div className="py-4 text-gray-400 text-sm">No active sessions found.</div>
            ) : (
              sessions.map((session, idx) => (
                <div key={session.id || idx} className="flex items-center gap-4 py-4">
                  <Monitor size={22} className="flex-shrink-0 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {session.device || session.userAgent || 'Unknown Device'}
                      </span>
                      {session.active && (
                        <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Active now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session.location || session.ip || ''}{' '}
                      {session.time || session.lastActive || ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;