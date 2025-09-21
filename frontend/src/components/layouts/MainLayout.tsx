import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Jewelry Store Management</h1>
            <div className="flex items-center space-x-4">
              {/* Add user profile, notifications, etc. */}
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
