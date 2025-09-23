import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { STORE_DISPLAY } from '../../config/store';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Products', path: '/products', icon: SparklesIcon },
    { name: 'Categories', path: '/categories', icon: FolderIcon },
    { name: 'Vendors', path: '/vendors', icon: UsersIcon },
    { name: 'Invoices', path: '/invoices', icon: DocumentTextIcon },
    { name: 'Employees', path: '/employees', icon: UserGroupIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', path: '/settings', icon: CogIcon },
  ];

  return (
    <div className="flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 h-screen shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 bg-jewelry-gold relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-jewelry-gold via-jewelry-gold-accent to-jewelry-gold-dark animate-gradient"></div>
        <div className="flex items-center space-x-2 relative z-10">
          <SparklesIcon className="h-8 w-8 text-gray-900 drop-shadow-sm" />
          <span className="text-gray-900 font-display font-bold text-xl drop-shadow-sm">{STORE_DISPLAY.brandName}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl sidebar-nav-item ${
                    isActive
                      ? 'sidebar-nav-active bg-gradient-to-r from-jewelry-gold to-jewelry-gold-accent text-gray-900 shadow-md transform scale-[1.01]'
                      : 'text-gray-700 hover:bg-white/20 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors duration-100 ease-out ${
                      isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto">
                      <div className="h-2 w-2 bg-gray-900 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="h-8 w-8 bg-jewelry-gold rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-gray-900">V</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{STORE_DISPLAY.brandName}</p>
            <p className="text-xs text-gray-600 truncate">{STORE_DISPLAY.systemName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
