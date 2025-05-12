import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import { MenuIcon, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SideMenu from './SideMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
      <SideMenu isOpen={true} onToggle={() => {}} />

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-20 transform lg:transform-none lg:opacity-100 lg:relative lg:inset-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'
        }`}
        style={{ marginLeft: '280px' }}
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
      <div className="flex flex-col flex-1 w-full overflow-hidden" 
           style={{ marginLeft: '280px' }}>
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