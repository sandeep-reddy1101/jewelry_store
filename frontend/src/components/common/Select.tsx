import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'modern';
  size?: 'sm' | 'md' | 'lg';
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  icon,
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-sm',
    lg: 'h-12 px-4 text-sm',
  };

  const variantClasses = {
    default: `
      appearance-none block w-full border border-gray-300 rounded-md 
      shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 
      focus:border-primary-500 transition-colors
      ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
      ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
    `,
    modern: `
      appearance-none block w-full border border-gray-300 rounded-xl 
      focus:ring-0 focus:border-primary-400 focus:shadow-lg focus:shadow-primary-100 
      bg-white hover:border-gray-400 transition-all duration-200 font-medium 
      text-gray-900 cursor-pointer
      ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
      ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
    `,
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <select
          className={`
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${icon ? 'pl-10' : ''}
            pr-10
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {variant === 'modern' ? (
            <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
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
