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

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 
          ${isCollapsed ? 'w-[72px]' : 'w-64'} 
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:relative
        `}
      >
        <SideNav
          mode="full"
          isCollapsed={isCollapsed}
          onCollapsedChange={setIsCollapsed}
          onToggleMode={() => {}}
          isOpen={true}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300`}
      >
        <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;