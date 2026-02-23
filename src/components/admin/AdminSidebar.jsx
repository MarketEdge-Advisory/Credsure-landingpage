import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Percent,
  Calculator,
  FileText,
  Settings,
  LogOut,
  Monitor,
} from 'lucide-react';

const navSections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    ],
  },
  {
    label: 'Suzuki Admin',
    items: [
      { name: 'Car Mangement', icon: Truck, path: '/admin/car-management' },
    ],
  },
  {
    label: 'Credsure Admin',
    items: [
      { name: 'Interest Rate Management', icon: Percent, path: '/admin/interest-rate' },
      { name: 'Calculator Input Mgt', icon: Calculator, path: '/admin/calculator-input' },
      { name: 'Loan Term Management', icon: FileText, path: '/admin/loan-term' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { name: 'Platform Settings', icon: Settings, path: '/admin/settings' },
    ],
  },
];

const AdminSidebar = () => {
  return (
    <aside className="flex flex-col bg-[#0d1e3a] self-stretch w-64 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        {/* Suzuki logo */}
        <img
          src="/credsure-real-logo.svg"
          alt="Credsure"
          className="h-6 w-auto object-contain brightness-0 invert"
        />
        {/* Divider */}
        <div className="w-px h-5 bg-white/20" />
        {/* CredSure Loans */}
        <div className="bg-white rounded px-1.5 py-0.5 flex items-center">
          <img
            src="/suzuki-by-cfao-logo.svg"
            alt="Suzuki"
            className="h-5 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-gray-400 text-xs font-semibold tracking-wider mb-1.5 px-2">
              {section.label}
            </p>
            <ul className="space-y-1">
              {section.items.map(({ name, icon: Icon, path }) => (
                <li key={name}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#1e3f6e] text-white'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Welcome Card */}
      <div className="mx-3 mb-3 rounded-xl bg-[#132f52] p-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center mb-3">
            <Monitor size={18} className="text-white" />
          </div>
          <p className="text-white font-bold text-sm mb-1">Welcome</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Manage, monitor, and maintain system operations from here.
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute -right-1 -top-4 w-12 h-12 rounded-full bg-white/5" />
      </div>

      {/* Log Out */}
      <div className="border-t border-white/10 mx-4" />
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1e3f6e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            CS
          </div>
          <div className="leading-tight">
            <p className="text-white text-sm font-medium">Log Out</p>
            <p className="text-gray-400 text-xs truncate max-w-[110px]">credsuresuzuki@g</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
