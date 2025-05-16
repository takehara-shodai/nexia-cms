import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Moon,
  Sun,
  Menu,
  ChevronLeft,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { navigationItems } from '@/data/navigation';

type SideNavProps = {
  mode: 'compact' | 'full';
  isOpen?: boolean;
  onClose?: () => void;
  onToggleMode: () => void;
};

const SideNav = ({
  mode: _mode,
  isOpen = true,
  onClose,
  onToggleMode: _onToggleMode,
}: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isItemActive = (item: { path: string; key: string }): boolean => {
    if (item.path === '/' && location.pathname === '/') {
      return true;
    }
    return item.path !== '/' && location.pathname.startsWith(item.path);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className={`h-full flex flex-col bg-[#3B4992] text-white transition-all duration-300 ${
        isCollapsed ? 'w-[72px]' : 'w-full'
      }`}
    >
      {/* Header */}
      <div className="h-16 min-h-[64px] px-4 flex items-center justify-between border-b border-[#4B5AA7]">
        {!isCollapsed ? (
          <>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="ml-2 text-lg font-semibold">日報アプリ</span>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-white/80" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-white/80" />
          </button>
        )}
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="h-16 min-h-[64px] px-4 flex items-center border-b border-[#4B5AA7]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon size={20} className="text-white" />
            </div>
            <div className="ml-2">
              <div className="font-medium">武原将大</div>
              <div className="text-sm text-white/70">開発部</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {!isCollapsed && (
          <button
            onClick={() => handleNavigation('/content/create')}
            className="w-full px-4 py-3 mb-2 bg-white rounded-lg mx-4 text-[#3B4992] font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
          >
            <span>新規日報作成</span>
          </button>
        )}

        <div className="px-2">
          {navigationItems.map(item => (
            <button
              key={item.key}
              onClick={() => {
                if (isCollapsed) {
                  setIsCollapsed(false);
                } else if (item.children) {
                  toggleItem(item.key);
                } else if (item.path) {
                  handleNavigation(item.path);
                }
              }}
              className={`w-full text-left transition-colors outline-none ${
                isItemActive(item)
                  ? 'bg-white/10'
                  : expandedItems[item.key]
                  ? 'bg-white/5'
                  : 'hover:bg-white/5'
              } rounded-lg mb-1`}
            >
              <div className={`px-4 py-3 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center">
                  <span className="text-white/80">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                </div>
                {!isCollapsed && item.children &&
                  (expandedItems[item.key] ? (
                    <ChevronDown size={18} className="text-white/60" />
                  ) : (
                    <ChevronRight size={18} className="text-white/60" />
                  ))}
              </div>
              {!isCollapsed && item.children && expandedItems[item.key] && (
                <div className="pb-2">
                  {item.children.map(child => (
                    <button
                      key={child.key}
                      onClick={() => handleNavigation(child.path)}
                      className={`w-full px-11 py-2 text-left ${
                        location.pathname === child.path
                          ? 'bg-white/10'
                          : 'hover:bg-white/5'
                      } transition-colors`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-[#4B5AA7] ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors mb-2 ${
            isCollapsed ? 'w-10 justify-center' : 'w-full'
          }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{theme === 'dark' ? 'ライトモード' : 'ダークモード'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 p-2 text-white/90 hover:bg-white/5 rounded-lg transition-colors ${
            isCollapsed ? 'w-10 justify-center' : 'w-full'
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>ログアウト</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNav;