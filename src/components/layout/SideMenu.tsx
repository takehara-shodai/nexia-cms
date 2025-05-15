import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  FolderKanban, 
  Settings, 
  Building, 
  Users, 
  Shield, 
  Database,
  Bell,
  LogOut,
  User as UserIcon,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import { useTenantStore } from '../../store/tenantStore';

interface SideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  showSidebar?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onToggle, showSidebar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { currentTenant, tenants, setCurrentTenant } = useTenantStore();

  const handleSectionClick = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
        isOpen ? 'w-[280px]' : 'w-0'
      }`}
    >
      {isOpen && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 m-0 p-0" 
               style={{ height: '64px', minHeight: '64px', boxSizing: 'border-box' }}>
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="ml-2 text-lg font-semibold">CMS.VAREAL.APP</span>
              </div>
              {/* PC用切り替えボタン（Sidebarへ） */}
              <button
                onClick={onToggle}
                className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors hidden lg:block"
                aria-label="Show sidebar"
              >
                <ChevronLeft size={20} />
              </button>
              {/* モバイル/タブレット用閉じるボタン */}
              <button
                onClick={onToggle}
                className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
                aria-label="Close side menu"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-0">
            {/* Projects Section */}
            <div className="m-0 p-0">
              <div className="block w-full h-16 m-0 p-0"
                   style={{ height: '64px', minHeight: '64px' }}>
                <button
                  onClick={() => handleSectionClick('projects')}
                  className="w-full h-16 inline-flex items-center justify-between px-4 transition-colors"
                  style={{ height: '64px', minHeight: '64px', boxSizing: 'border-box' }}
                >
                  <div className="flex items-center">
                    <FolderKanban size={20} />
                    <span className="ml-3 font-medium">プロジェクト</span>
                  </div>
                </button>
              </div>
              {activeSection === 'projects' && (
                <div className="pl-10 mt-1 space-y-1">
                  <button className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    プロジェクト一覧
                  </button>
                  <button className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    新規プロジェクト
                  </button>
                </div>
              )}
            </div>

            {/* Tenant Settings Section */}
            <div className="m-0 p-0">
              <div className="block w-full h-16 m-0 p-0"
                   style={{ height: '64px', minHeight: '64px' }}>
                <button
                  onClick={() => handleSectionClick('tenant')}
                  className="w-full h-16 inline-flex items-center justify-between px-4 transition-colors"
                  style={{ height: '64px', minHeight: '64px', boxSizing: 'border-box' }}
                >
                  <div className="flex items-center">
                    <Building size={20} />
                    <span className="ml-3 font-medium">テナント設定</span>
                  </div>
                </button>
              </div>
              {activeSection === 'tenant' && (
                <div className="pl-10 mt-1 space-y-1">
                  <button className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    基本設定
                  </button>
                  <button className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    ユーザー管理
                  </button>
                  <button className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    権限設定
                  </button>
                  <button className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    API設定
                  </button>
                </div>
              )}
            </div>

            {/* Tenant Switcher */}
            <div className="px-4 py-4">
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">現在のテナント</span>
              </div>
              <select
                value={currentTenant?.id}
                onChange={(e) => {
                  const tenant = tenants.find(t => t.id === e.target.value);
                  if (tenant) setCurrentTenant(tenant);
                }}
                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'ライトモード' : 'ダークモード'}</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <UserIcon size={20} />
              <span>プロフィール</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Bell size={20} />
              <span>通知</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideMenu;