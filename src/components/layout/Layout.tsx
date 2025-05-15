import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '@/components/layout/SideNav';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import { MenuIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Layout = () => {
  const [navMode, setNavMode] = useState<'compact' | 'full'>('full'); // PC用: full=Sidebar表示、compact=SideMenu表示
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { theme } = useTheme();

  const toggleNavMode = () => {
    setNavMode(prev => (prev === 'full' ? 'compact' : 'full'));
  };

  return (
    <div
      className={`flex h-full ${theme}`}
      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
    >
      {/* PC（lg以上）: 常に表示 */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30 w-[280px]">
        <SideNav mode={navMode} onToggleMode={toggleNavMode} />
      </div>

      {/* モバイル/タブレット用（stateで開閉） */}
      {mobileNavOpen && (
        <>
          <div className="fixed left-0 top-0 h-full z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-[280px] lg:hidden">
            <SideNav
              mode={navMode}
              isOpen={true}
              onClose={() => setMobileNavOpen(false)}
              onToggleMode={toggleNavMode}
            />
          </div>
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          ></div>
        </>
      )}

      {/* モバイル用メニューボタン */}
      {!mobileNavOpen && (
        <button
          onClick={() => setMobileNavOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md focus:outline-none lg:hidden border-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent"
          aria-label="Open navigation"
        >
          <MenuIcon size={20} />
        </button>
      )}

      {/* メインコンテンツ */}
      <div
        className="flex flex-col flex-1 w-full overflow-hidden lg:ml-[280px]"
        style={{ minHeight: '100vh' }}
      >
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
