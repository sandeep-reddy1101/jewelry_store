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
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: HomeIcon, 
      badge: null,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Products', 
      path: '/products', 
      icon: SparklesIcon, 
      badge: null,
      gradient: 'from-amber-500 to-amber-600'
    },
    { 
      name: 'Categories', 
      path: '/categories', 
      icon: FolderIcon, 
      badge: null,
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Vendors', 
      path: '/vendors', 
      icon: UsersIcon, 
      badge: null,
      gradient: 'from-green-500 to-green-600'
    },
    { 
      name: 'Invoices', 
      path: '/invoices', 
      icon: DocumentTextIcon, 
      badge: '3',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      name: 'Employees', 
      path: '/employees', 
      icon: UserGroupIcon, 
      badge: null,
      gradient: 'from-teal-500 to-teal-600'
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: ChartBarIcon, 
      badge: null,
      gradient: 'from-pink-500 to-pink-600'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: CogIcon, 
      badge: null,
      gradient: 'from-gray-500 to-gray-600'
    },
  ];

  return (
    <div className="flex flex-col w-72 bg-gradient-to-b from-white via-blue-50/50 to-indigo-100/50 backdrop-blur-xl border-r border-white/20 h-screen shadow-2xl relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/30 to-indigo-50/40 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-jewelry-gold/5 via-transparent to-blue-500/5"></div>

      {/* Logo Section */}
      <div className="relative z-10 flex items-center justify-center h-20 bg-gradient-to-r from-jewelry-gold via-jewelry-gold-accent to-jewelry-gold-dark relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-jewelry-gold/90 via-jewelry-gold-accent/90 to-jewelry-gold-dark/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/10 to-transparent"></div>
        
        <div className="flex items-center space-x-3 relative z-10">
          <div className="relative">
            <SparklesIcon className="h-10 w-10 text-gray-900 drop-shadow-lg" />
            <div className="absolute inset-0 bg-jewelry-gold/20 rounded-full"></div>
          </div>
          <div className="transition-all duration-300">
            <span className="text-gray-900 font-display font-bold text-2xl drop-shadow-lg tracking-wide">
              {STORE_DISPLAY.brandName}
            </span>
            <div className="h-0.5 bg-gradient-to-r from-gray-900/50 to-transparent rounded-full mt-1"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 relative z-10 sidebar-scrollbar">
        <div className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`relative flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ease-in-out transform ${
                    isActive
                      ? 'bg-gradient-to-r from-white/90 to-white/70 text-gray-800 shadow-lg shadow-blue-200/50 scale-[1.02] border border-white/50'
                      : 'text-gray-700 hover:bg-white/40 hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border hover:border-white/30'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full shadow-lg"></div>
                  )}
                  
                  {/* Icon with Gradient Background */}
                  <div className="relative mr-4">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-blue-200/30` 
                        : 'bg-white/50 group-hover:bg-white/70 group-hover:shadow-md'
                    }`}>
                      <Icon
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive 
                            ? item.gradient.includes('jewelry-gold') 
                              ? 'text-amber-900 drop-shadow-lg' 
                              : 'text-white drop-shadow-sm'
                            : 'text-gray-600 group-hover:text-gray-800'
                        }`}
                      />
                    </div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium tracking-wide">{item.name}</span>
                    {isActive && (
                      <div className="flex items-center space-x-1">
                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                        <div className="h-1 w-1 bg-blue-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="relative z-10 p-4 border-t border-white/20 bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm">
        <div className="px-3">
          <div className="bg-gradient-to-r from-white/70 to-white/40 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-jewelry-gold to-jewelry-gold-dark rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-gray-900 drop-shadow-sm">V</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate tracking-wide">{STORE_DISPLAY.brandName}</p>
                <p className="text-xs text-gray-600 truncate font-medium">{STORE_DISPLAY.systemName}</p>
                <div className="flex items-center mt-1 space-x-1">
                  <div className="h-1 w-1 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Version Info */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Version 2.1.0 • © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
