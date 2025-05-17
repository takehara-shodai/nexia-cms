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
  X,
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
    setExpandedItems(prev => {
      const newState = { ...prev };
      
      // 他のメニューが展開されている場合は閉じる
      if (!prev[key]) {
        Object.keys(prev).forEach(k => {
          if (k !== key) newState[k] = false;
        });
      }
      
      // クリックしたメニューの状態を切り替え
      newState[key] = !prev[key];
      
      return newState;
    });
  };

  const handleNavigation = (path: string, parentKey?: string) => {
    navigate(path);
    
    // 親メニューが指定されている場合は展開状態を維持
    if (parentKey) {
      setExpandedItems(prev => ({
        ...Object.keys(prev).reduce((acc, key) => ({
          ...acc,
          [key]: key === parentKey ? true : false
        }), {}),
        [parentKey]: true
      }));
    }

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
      className={`h-screen flex flex-col bg-[#3B4992] text-white ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 min-h-[64px] px-4 flex items-center justify-between border-b border-[#4B5AA7] flex-shrink-0">
        {!isCollapsed ? (
          <>
            <span className="text-base lg:text-lg font-semibold whitespace-nowrap">VAREAL.CMS.APP</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onCollapsedChange(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:block hidden"
              >
                <Menu size={18} className="text-white/80" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
              >
                <X size={18} className="text-white/80" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => onCollapsedChange(false)}
            className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors flex justify-center"
          >
            <Menu size={18} className="text-white/80" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="h-16 min-h-[64px] px-4 flex items-center border-y border-[#4B5AA7] flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon size={18} className="text-white" />
            </div>
            <div className="ml-2">
              <div className="font-medium">武原将大</div>
              <div className="text-sm text-white/70">開発部</div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon size={18} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#4B5AA7] scrollbar-track-transparent">
        <div className="px-2">
          {navigationItems.map(item => {
            const isActive = isItemActive(item);
            const isExpanded = expandedItems[item.key];
            
            return (
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
                className={`w-full text-left transition-colors outline-none rounded-lg mb-1 ${
                  isActive
                    ? 'bg-white/15'
                    : isExpanded
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`px-4 py-2.5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                  <div className="flex items-center min-w-0">
                    <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {item.icon}
                    </span>
                    <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-auto ml-3'}`}>
                      <span className={`text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive ? 'text-white' : 'text-white/90'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                  {!isCollapsed && item.children && (
                    <span className="flex-shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronDown size={16} className={`transition-colors ${isActive ? 'text-white' : 'text-white/60'}`} />
                      ) : (
                        <ChevronRight size={16} className={`transition-colors ${isActive ? 'text-white' : 'text-white/60'}`} />
                      )}
                    </span>
                  )}
                </div>
                {!isCollapsed && item.children && isExpanded && (
                  <div className="pb-1 bg-white/5">
                    {item.children.map(child => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <button
                          key={child.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigation(child.path, item.key);
                          }}
                          className={`w-full px-11 py-2 text-left text-xs transition-colors whitespace-nowrap ${
                            isChildActive
                              ? 'bg-white/15 text-white'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-[#4B5AA7] mt-auto flex-shrink-0 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors mb-2 ${
            isCollapsed ? 'w-10 justify-center' : 'w-full'
          }`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-auto'}`}>
            <span className="text-xs whitespace-nowrap">{theme === 'dark' ? 'ライトモード' : 'ダークモード'}</span>
          </div>
        </button>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 p-2 text-white/90 hover:bg-white/5 rounded-lg transition-colors ${
            isCollapsed ? 'w-10 justify-center' : 'w-full'
          }`}
        >
          <LogOut size={18} />
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-auto'}`}>
            <span className="text-xs whitespace-nowrap">ログアウト</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SideNav;