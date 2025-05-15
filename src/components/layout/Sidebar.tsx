import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { navigationItems } from '../../data/navigation';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  closeSidebar: () => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar, onToggle }) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <div className="w-[280px] h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto relative">
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
          {/* SideMenuに戻るボタン（ChevronRight） */}
          <button
            onClick={onToggle}
            className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Show side menu"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 py-0">
        <ul className="px-0 m-0">
          {navigationItems.map((item) => (
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
                  className={`w-full h-16 inline-flex items-center justify-between px-4 ${
                    expandedItems[item.key] ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                  style={{ height: '64px', minHeight: '64px', boxSizing: 'border-box' }}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 font-medium">{item.label}</span>
                  </div>
                  {item.children && (
                    expandedItems[item.key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                  )}
                </button>
              </div>
              {item.children && expandedItems[item.key] && (
                <ul className="pl-10 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.key}>
                      <button
                        onClick={() => handleNavigation(child.path)}
                        className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;