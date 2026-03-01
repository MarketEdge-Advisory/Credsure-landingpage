import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const routeLabels = {
  dashboard: 'Dashboard',
  'car-management': 'Car Management',
  'interest-rate': 'Interest Rate Management',
  'calculator-input': 'Calculator Input Mgt',
  'loan-term': 'Loan Term Management',
  settings: 'Platform Settings',
};

const AdminHeader = ({ onHamburgerClick }) => {
  const { pathname } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAuth();

   const navigate = useNavigate();

  const handleLogout = () => {
    // Remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optional: clear everything
    // localStorage.clear();

    // Redirect to login page
    navigate("/");
  };

  // Derive current page label from pathname
  const segment = pathname.split('/').filter(Boolean).pop();
  const pageLabel = routeLabels[segment] ?? 'Dashboard';

  const notifications = [
    { id: 1, text: 'New loan application received', time: '2m ago', unread: true },
    { id: 2, text: 'Interest rate updated successfully', time: '1h ago', unread: true },
    { id: 3, text: 'Car inventory sync complete', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between relative z-30">
      {/* Left: Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {/* Hamburger icon for mobile */}
        <button
          className="md:hidden mr-2 p-2 rounded focus:outline-none hover:bg-gray-100"
          onClick={onHamburgerClick}
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-gray-400 font-medium">Pages</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-semibold">{pageLabel}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setDropdownOpen(false); }}
            className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell size={19} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
            )}
          </button>

          {/* Notifications panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pb-2 border-b border-gray-100">
                Notifications
              </p>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${
                    n.unread ? 'bg-blue-50/50' : ''
                  }`}
                >
                  {n.unread && (
                    <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                  )}
                  <div className={n.unread ? '' : 'pl-5'}>
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 font-bold text-sm">
                {user?.initials || 'AD'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.email || 'admin@credsure.com'}
            </span>
            <ChevronDown
              size={15}
              className={`text-gray-400 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
              {/* <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User size={15} className="text-gray-400" />
                My Profile
              </button> */}
              <button 
              onClick={() => navigate('/admin/profile-settings')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                
                <Settings size={15} className="text-gray-400" />
                Account Settings
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button 
               onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(dropdownOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setDropdownOpen(false); setNotifOpen(false); }}
        />
      )}
    </header>
  );
};

export default AdminHeader;
