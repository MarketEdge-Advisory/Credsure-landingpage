import React, { useState } from 'react';
import { Monitor, MoreVertical } from 'lucide-react';

const sessions = [
  {
    id: 1,
    device: '2018 Macbook Pro 15-inch',
    location: 'Melbourne, Australia',
    time: '22 Jan at 10:40am',
    active: true,
  },
  {
    id: 2,
    device: '2018 Macbook Pro 15-inch',
    location: 'Melbourne, Australia',
    time: '22 Jan at 4:20pm',
    active: false,
  },
];

const PlatformSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('········');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="p-8 w-full">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Set and modify Password settings.</p>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* Password Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Change Password</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Please enter your current password to change your password.
            </p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Save Details
          </button>
        </div>

        <div className="grid grid-cols-[200px_1fr] gap-8 pb-8 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700 pt-2">Input password details</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Where you're logged in */}
        <div className="pt-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-semibold text-gray-900">Where you're logged in</p>
              <p className="text-sm text-gray-400 mt-0.5">
                We'll alert you via{' '}
                <span className="text-blue-500">cresdsuresuzuki@gmail.com</span>{' '}
                if there is any unusual activity on your account.
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="mt-5 flex flex-col divide-y divide-gray-100">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 py-4">
                <div className="flex-shrink-0 text-gray-400">
                  <Monitor size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{session.device}</span>
                    {session.active && (
                      <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                        Active now
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {session.location} • {session.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformSettings;
