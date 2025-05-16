import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Building,
  Menu as MenuIcon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTenantStore } from '@/store/tenantStore';
import { supabase } from '@/lib/supabase';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { currentTenant, tenants, fetchTenants, setCurrentTenant } = useTenantStore();

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleTenantSwitch = (tenant: typeof currentTenant) => {
    if (tenant) {
      setCurrentTenant(tenant);
      setUserMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
      >
        <MenuIcon size={24} />
      </button>

      <div className="flex-1 max-w-lg ml-4 lg:ml-12">
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-medium flex justify-between items-center">
                <span>Notifications</span>
                <a href="#" className="text-blue-600 dark:text-blue-400 text-sm">
                  Mark all as read
                </a>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-2">
                      <Bell size={16} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">New comment on article</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 minutes ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-2">
                      <User size={16} className="text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                <a href="#" className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>

        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 focus:outline-none"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              A
            </div>
            <span className="hidden md:block font-medium">Admin</span>
            <ChevronDown size={16} className="hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium">現在のテナント</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentTenant?.name || 'テナントが選択されていません'}
                </p>
              </div>
              <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  テナント切替
                </p>
                {tenants.map(tenant => (
                  <button
                    key={tenant.id}
                    onClick={() => handleTenantSwitch(tenant)}
                    className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 ${
                      tenant.id === currentTenant?.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Building size={16} />
                    {tenant.name}
                  </button>
                ))}
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <User size={16} className="mr-2" />
                Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </a>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;