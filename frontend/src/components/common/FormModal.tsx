import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'lg',
  showCloseButton = true 
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div 
          className={`
            relative w-full ${sizeClasses[size]} 
            transform rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5
            transition-all duration-300 ease-out animate-slide-up
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 truncate pr-4">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  flex-shrink-0 p-2 -m-2 rounded-full text-gray-400 
                  hover:text-gray-600 hover:bg-gray-100 
                  transition-colors duration-200 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="px-6 py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
