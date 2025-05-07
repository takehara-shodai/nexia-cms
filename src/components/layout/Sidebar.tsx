import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { navigationItems } from '../../data/navigation';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
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
    <aside className="w-64 h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="ml-2 text-lg font-semibold">CMS.VAREAL.APP</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.key} className="mb-1">
              <button
                onClick={() => {
                  if (item.children) {
                    toggleItem(item.key);
                  } else if (item.path) {
                    handleNavigation(item.path);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                  expandedItems[item.key]
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3 font-medium">{item.label}</span>
                </div>
                {item.children && (
                  expandedItems[item.key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                )}
              </button>
              
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
    </aside>
  );
};

export default Sidebar;