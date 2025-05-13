import React, { useState } from 'react';
import SideMenu from './SideMenu';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import { MenuIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // PC用: false=SideMenu, true=Sidebar
  const { theme } = useTheme();

  return (
    <div className={`flex h-full ${theme}`} style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* PC（lg以上）: SideMenu/Sidebar排他的切り替え */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30 w-[280px] transition-all duration-300">
        {showSidebar ? (
          <Sidebar
            closeSidebar={() => {}}
            onToggle={() => setShowSidebar(false)}
          />
        ) : (
          <SideMenu
            isOpen={true}
            onToggle={() => setShowSidebar(true)}
            showSidebar={showSidebar}
          />
        )}
      </div>

      {/* SideMenu: モバイル/タブレット用（stateで開閉） */}
      {sideMenuOpen && (
        <>
          <div className="fixed left-0 top-0 h-full z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-[280px] lg:hidden">
            <SideMenu isOpen={true} onToggle={() => setSideMenuOpen(false)} />
          </div>
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setSideMenuOpen(false)}></div>
        </>
      )}

      {/* Sidebar: モバイル/タブレット用（stateで開閉） */}
      {sidebarOpen && (
        <>
          <div className="fixed left-0 top-0 h-full z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-[280px] lg:hidden">
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        </>
      )}

      {/* ハンバーガーメニュー（SideMenu用）: モバイル/タブレットのみ */}
      {!sideMenuOpen && !sidebarOpen && (
        <button
          onClick={() => setSideMenuOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md focus:outline-none lg:hidden"
          aria-label="Open side menu"
        >
          <MenuIcon size={20} />
        </button>
      )}
      {/* Sidebarを開くボタン: モバイル/タブレットのみ */}
      {!sideMenuOpen && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-12 lg:hidden"
          aria-label="Open sidebar"
        >
          <span>&lt;</span>
        </button>
      )}

      {/* メインコンテンツ */}
      <div className="flex flex-col flex-1 w-full overflow-hidden lg:ml-[280px]" style={{ minHeight: '100vh' }}>
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