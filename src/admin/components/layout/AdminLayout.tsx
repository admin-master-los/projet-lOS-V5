import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Breadcrumbs from './Breadcrumbs';

/**
 * Layout principal de l'interface admin
 * Structure : Sidebar + (TopBar + Content)
 */

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0A0A0B] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumbs + Page content */}
          <div className="p-6">
            <Breadcrumbs />
            
            {/* Page content (via React Router Outlet) */}
            <div className="mt-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
