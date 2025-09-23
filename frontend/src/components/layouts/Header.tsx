import React from 'react';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onSearch, showSearch = false }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-modern">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Title and Search */}
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-display font-bold text-gray-800 text-contrast">{title}</h1>
          
          {showSearch && (
            <div className="hidden md:flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-80 pl-10 pr-3 py-2 border-0 rounded-xl leading-5 bg-white/60 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg text-gray-800"
                  placeholder="Search products, invoices, customers..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Right section - User actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">Quick:</span>
            <button className="px-3 py-1 text-xs bg-jewelry-gold text-gray-900 font-semibold rounded-full hover:shadow-glow-gold transition-all duration-300 transform hover:scale-105">
              New Sale
            </button>
            <button className="px-3 py-1 text-xs bg-modern-primary text-white font-semibold rounded-full hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105">
              Add Product
            </button>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg transition-colors duration-200">
            <span className="sr-only">View notifications</span>
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
