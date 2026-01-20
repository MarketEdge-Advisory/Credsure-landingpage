import React from "react";
import { UserRound, Bell } from "lucide-react";

const DefaultHeader = () => {
  return (
    <header className="w-full bg-slate-50 border-b border-[#D9D9D9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center">

          {/* LEFT — FIXED */}
          <div className="flex items-center gap-3 w-56 shrink-0">
            <img
              src="/kaihma-k.svg"
              alt="Kaihma Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-semibold text-[#0D1C0F]">
              Kaihma
            </span>
          </div>

          {/* CENTER — NAV (TRUE CENTER) */}
          <nav className="flex flex-1 justify-center">
            <ul className="hidden md:flex items-center gap-12 text-[#0D1C0F] font-medium">
              <li>Dashboard</li>
              <li>Orders</li>
              <li>Products</li>
              <li>Customers</li>
              <li>Marketing</li>
              <li>Analytics</li>
            </ul>
          </nav>

          {/* RIGHT — ICONS */}
          <div className="flex items-center gap-4 shrink-0">
            <Bell className="h-6 w-6 text-[#0D1C0F] bg-[#E8F2E8] rounded-lg p-1.5" />
            <UserRound className="h-8 w-8 rounded-full bg-[#D9D9D9] p-1 text-[#0D1C0F]" />
          </div>

        </div>
      </div>
    </header>
  );
};

export default DefaultHeader;
