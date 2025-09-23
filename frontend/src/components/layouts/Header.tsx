import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gradient-to-r from-jewelry-gold-light to-jewelry-gold-dark backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Title */}
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 drop-shadow-sm">{title}</h1>
        </div>

        {/* Right section - User actions */}
        <div className="flex items-center space-x-4">
          {/* Optimized Quick Actions */}
          <button className="px-4 py-2 text-sm bg-jewelry-gold text-gray-900 font-semibold rounded-full hover:shadow-glow-gold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-jewelry-gold">
            New Sale
          </button>
          <button className="px-4 py-2 text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-gray-900 font-semibold rounded-full hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500">
            Add Product
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg transition-colors duration-200" aria-label="View notifications">
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div className="hidden md:block text-left">
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-gray-500">Store Manager</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
