import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
//   ChevronLeft, 
  ChevronRight,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
// import { useTenantStore } from '@/store/tenantStore';
import { navigationItems } from '@/data/navigation';

type SideNavProps = {
  mode: 'compact' | 'full'; // compact=SideMenu, full=Sidebar
  isOpen?: boolean;
  onClose?: () => void;
  onToggleMode: () => void;
};

const SideNav = ({ mode, isOpen = true, onClose, onToggleMode }: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  // テナント関連の変数は使用しないためコメントアウト
  // const { currentTenant, tenants, setCurrentTenant } = useTenantStore();

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // モバイル表示の場合はメニューを閉じる
    if (window.innerWidth < 1024 && onClose) {  // lg breakpoint = 1024px
      onClose();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // 現在のパスからアクティブなメニューアイテムを判断する
  const isItemActive = (item: any): boolean => {
    if (item.path === '/' && location.pathname === '/') {
      return true;
    }
    return item.path !== '/' && location.pathname.startsWith(item.path);
  };

  // 表示されていない場合は何も表示しない（モバイル用）
  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* ヘッダー・ロゴ・切り替えボタン */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 m-0 p-0" 
           style={{ height: '64px', minHeight: '64px', boxSizing: 'border-box' }}>
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="ml-2 text-lg font-semibold">CMS.VAREAL.APP</span>
          </div>
          {/* モード切り替えボタン - 一時的に非表示 */}
          {/* <button
            onClick={onToggleMode}
            className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={mode === 'compact' ? "Switch to full mode" : "Switch to compact mode"}
          >
            {mode === 'compact' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button> */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-0">
        {/* Navigation Items */}
        <ul className="px-0 m-0">
          {navigationItems.map((item) => {
            const isActive = isItemActive(item);
            return (
              <li key={item.key} className="block m-0 p-0">
                <div 
                  className="block w-full h-16 m-0 p-0"
                  style={{ height: '64px', minHeight: '64px' }}
                >
                  <button
                    onClick={() => {
                      if (item.children) {
                        toggleItem(item.key);
                      } else if (item.path) {
                        handleNavigation(item.path);
                      }
                    }}
                    className={`w-full h-16 inline-flex items-center justify-between px-4 transition-colors outline-none focus:outline-none ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : expandedItems[item.key] ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    style={{ height: '64px', minHeight: '64px', boxSizing: 'border-box', border: 'none' }}
                  >
                    <div className="flex items-center">
                      <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                        {item.icon}
                      </span>
                      <span className={`ml-3 font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.children && (
                      expandedItems[item.key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                    )}
                  </button>
                </div>
                {item.children && expandedItems[item.key] && (
                  <ul className="pl-10 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <li key={child.key}>
                          <button
                            onClick={() => handleNavigation(child.path)}
                            className={`block w-full text-left py-2 px-4 rounded-md transition-colors outline-none focus:outline-none ${
                              isChildActive 
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            style={{ border: 'none' }}
                          >
                            {child.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* テナントセレクトは非表示 */}
        {/* <div className="px-4 py-4">
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
        </div> */}
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
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
};

export default SideNav; 