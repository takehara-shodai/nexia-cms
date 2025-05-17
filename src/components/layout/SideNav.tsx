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
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

const SideNav = ({
  mode: _mode,
  isOpen = true,
  onClose,
  onToggleMode: _onToggleMode,
  isCollapsed,
  onCollapsedChange,
}: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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
      className={`h-screen flex flex-col bg-[#3B4992] text-white transition-all duration-300 ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 min-h-[64px] px-4 flex items-center justify-between border-b border-[#4B5AA7] flex-shrink-0">
        {!isCollapsed ? (
          <>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="ml-2 text-base lg:text-lg font-semibold">VAREAL.CMS.APP</span>
            </div>
            <button
              onClick={() => onCollapsedChange(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-white/80" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onCollapsedChange(false)}
            className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-white/80" />
          </button>
        )}
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="h-16 min-h-[64px] px-4 flex items-center border-b border-[#4B5AA7] flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon size={20} className="text-white" />
            </div>
            <div className="ml-2">
              <div className="text-sm lg:text-base font-medium">武原将大</div>
              <div className="text-xs lg:text-sm text-white/70">開発部</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#4B5AA7] scrollbar-track-transparent">
        <div className="px-2">
          {navigationItems.map(item => (
            <button
              key={item.key}
              onClick={() => {
                if (isCollapsed) {
                  onCollapsedChange(false);
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
              <div className={`px-4 py-2.5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center">
                  <span className="text-white/80">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                </div>
                {!isCollapsed && item.children &&
                  (expandedItems[item.key] ? (
                    <ChevronDown size={16} className="text-white/60" />
                  ) : (
                    <ChevronRight size={16} className="text-white/60" />
                  ))}
              </div>
              {!isCollapsed && item.children && expandedItems[item.key] && (
                <div className="pb-1">
                  {item.children.map(child => (
                    <button
                      key={child.key}
                      onClick={() => handleNavigation(child.path)}
                      className={`w-full px-11 py-2 text-left text-xs ${
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
      <div className={`p-4 border-t border-[#4B5AA7] flex-shrink-0 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors mb-2 ${
            isCollapsed ? 'w-10 justify-center' : 'w-full'
          }`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!isCollapsed && <span className="text-xs">{theme === 'dark' ? 'ライトモード' : 'ダークモード'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 p-2 text-white/90 hover:bg-white/5 rounded-lg transition-colors ${
            isCollapsed ? 'w-10 justify-center' : 'w-full'
          }`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-xs">ログアウト</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNav;