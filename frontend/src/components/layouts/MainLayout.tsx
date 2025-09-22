import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = (pathname: string) => {
    const routes: { [key: string]: string } = {
      '/': 'Dashboard',
      '/products': 'Products Management',
      '/categories': 'Product Categories',
      '/vendors': 'Vendor Management',
      '/invoices': 'Invoices & Billing',
      '/invoices/new': 'Create New Invoice',
      '/employees': 'Employee Management',
      '/analytics': 'Analytics & Reports',
      '/settings': 'System Settings',
    };
    return routes[pathname] || 'Jewelry Store Management';
  };

  const showSearchBar = ['/products', '/invoices', '/vendors', '/employees'].includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle(location.pathname)} 
          showSearch={showSearchBar}
        />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
