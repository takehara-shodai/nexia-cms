import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import { MenuIcon, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SideMenu from './SideMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(true);
  const { theme } = useTheme();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <div className={`flex h-full ${theme}`} style={{ 
      backgroundColor: 'var(--color-bg-primary)',
      color: 'var(--color-text-primary)'
    }}>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
        sideMenuOpen ? 'w-[280px]' : 'w-0'
      }`}>
        {sideMenuOpen && <SideMenu isOpen={sideMenuOpen} onToggle={toggleSideMenu} />}
      </div>

      {/* Side Menu Toggle Button */}
      <button
        onClick={toggleSideMenu}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label={sideMenuOpen ? 'Close side menu' : 'Open side menu'}
        style={{ 
          left: sideMenuOpen ? '280px' : '0',
          transform: 'translateY(-50%)'
        }}
      >
        {sideMenuOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-20 transform lg:transform-none lg:opacity-100 lg:relative lg:inset-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'
        }`}
        style={{ marginLeft: sideMenuOpen ? '280px' : '0' }}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden transition-all duration-300" 
           style={{ marginLeft: sideMenuOpen ? '280px' : '0' }}>
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;