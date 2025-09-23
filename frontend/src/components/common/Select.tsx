import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  icon,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <select
          className={`
            appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md 
            shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 
            focus:border-primary-500 sm:text-sm transition-colors
            ${icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
