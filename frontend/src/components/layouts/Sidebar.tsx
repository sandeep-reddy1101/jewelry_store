import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  FolderIcon,
  UsersIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

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
    <div className="flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 h-screen shadow-elegant">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 bg-gradient-to-r from-jewelry-gold to-jewelry-gold-dark">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-8 w-8 text-white" />
          <span className="text-white font-display font-bold text-xl">Elite Jewelry</span>
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
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-102'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto">
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce-gentle"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          <div className="h-8 w-8 bg-gradient-to-r from-jewelry-gold to-jewelry-gold-dark rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">JS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Jewelry Store</p>
            <p className="text-xs text-gray-400 truncate">Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
