import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '@/components/layout/SideNav';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div
        className={`fixed top-0 left-0 h-full z-20 transition-all duration-300 ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SideNav
          mode="full"
          isCollapsed={isCollapsed}
          onCollapsedChange={setIsCollapsed}
          onToggleMode={() => {}}
        />
      </div>
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          isCollapsed ? 'ml-[72px]' : 'ml-64'
        }`}
      >
        <TopBar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;