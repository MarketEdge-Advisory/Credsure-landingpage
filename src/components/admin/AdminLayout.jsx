
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar overlay for mobile
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb]">
      {/* Sidebar: hidden on mobile, drawer on mobile */}
      <div>
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onHamburgerClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
