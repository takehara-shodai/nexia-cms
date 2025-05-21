import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '@/components/layout/SideNav';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 
          w-3/4 md:w-1/2 lg:w-auto
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SideNav
          mode="full"
          isCollapsed={isCollapsed}
          onCollapsedChange={collapsed => {
            // Only allow collapse on desktop
            if (window.innerWidth >= 1024) {
              setIsCollapsed(collapsed);
            }
          }}
          onToggleMode={() => {}}
          isOpen={true}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen flex flex-col ${isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}
      >
        <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
