import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  PlusIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Mock notifications - in real app, fetch from API
  const notifications: Notification[] = [
    { id: 1, message: 'Low stock alert: Gold Ring (SKU: GR001)', type: 'warning', timestamp: '2 min ago' },
    { id: 2, message: 'New order received #INV-2024-001', type: 'success', timestamp: '5 min ago' },
    { id: 3, message: 'System backup completed successfully', type: 'info', timestamp: '1 hour ago' },
  ];

  const quickActions = [
    { label: 'New Sale', icon: PlusIcon, path: '/invoices/new', color: 'gold' },
    { label: 'Add Product', icon: PlusIcon, path: '/products?action=add', color: 'primary' },
    { label: 'Add Vendor', icon: PlusIcon, path: '/vendors?action=add', color: 'success' },
  ];

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Close dropdowns on Escape key
    if (e.key === 'Escape') {
      setShowUserMenu(false);
      setShowNotifications(false);
      setShowQuickActions(false);
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setShowQuickActions(false);
    navigate(action.path);
  };

  return (
    <header className="bg-gradient-to-r from-white/95 via-jewelry-gold-light/30 to-white/95 backdrop-blur-xl border-b border-white/20 shadow-elegant sticky top-0 z-50">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left section - Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
            {title}
          </h1>
        </div>

        {/* Right section - Actions & User */}
        <div className="flex items-center space-x-2">

          {/* Quick Actions Menu */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-jewelry-gold to-jewelry-gold-accent text-gray-900 font-semibold rounded-xl hover:shadow-glow-gold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-jewelry-gold/50"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden sm:block">Quick Actions</span>
              <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${showQuickActions ? 'rotate-180' : ''}`} />
            </button>

            {showQuickActions && (
              <div className="absolute right-0 mt-2 w-56 bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden animate-slide-down z-[9999]">
                <div className="p-2 bg-white">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
                    >
                      <action.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      <span className="font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-xl transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-xl transition-all duration-200"
              aria-label="View notifications"
            >
              <BellIcon className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden animate-slide-down z-[9999]">
                <div className="p-4 border-b border-gray-200 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto bg-white">
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mt-2 ${
                                notification.type === 'warning' ? 'bg-amber-400' :
                                notification.type === 'success' ? 'bg-green-400' :
                                'bg-blue-400'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 leading-relaxed">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                              </div>
                            </div>
                            <button 
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1.5 rounded-lg hover:bg-gray-100"
                              aria-label="Dismiss notification"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-gray-50 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-1">
                          View All Notifications
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center bg-white">
                      <BellIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2.5 text-sm rounded-xl text-gray-700 hover:bg-gray-100/70 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200 group"
            >
              <div className="relative">
                <UserCircleIcon className="h-7 w-7 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden md:block text-left">
                <div className="font-medium text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">{getGreeting()} • Store Manager</div>
              </div>
              <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden animate-slide-down z-[9999]">
                <div className="p-2 bg-white">
                  <button className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200 group">
                    <UserIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200 group">
                    <CogIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button className="w-full flex items-center space-x-3 px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 group">
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500 group-hover:text-red-600" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
