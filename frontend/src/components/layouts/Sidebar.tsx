import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'home' },
    { name: 'Products', path: '/products', icon: 'cube' },
    { name: 'Categories', path: '/categories', icon: 'folder' },
    { name: 'Vendors', path: '/vendors', icon: 'users' },
    { name: 'Invoices', path: '/invoices', icon: 'document-text' },
    { name: 'Employees', path: '/employees', icon: 'user-group' },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800 h-screen">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold text-xl">Jewelry Store</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
                  location.pathname === item.path ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
