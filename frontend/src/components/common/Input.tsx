import React, { forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helpText,
  icon,
  success,
  className = '',
  ...props
}, ref) => {
  const hasError = !!error;
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 h-5 w-5">
              {icon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-xl border-0 py-3 px-4
            ${icon ? 'pl-11' : 'pl-4'}
            ${hasError ? 'pr-10' : 'pr-4'}
            text-gray-800 bg-white/80 backdrop-blur-sm ring-1 ring-inset 
            ${hasError 
              ? 'ring-danger-300 focus:ring-danger-500 bg-danger-50/50' 
              : success 
                ? 'ring-success-300 focus:ring-success-500 bg-success-50/50'
                : 'ring-gray-200 focus:ring-primary-500 hover:ring-gray-300'
            }
            placeholder:text-gray-500 
            focus:ring-2 focus:ring-inset focus:bg-white
            transition-all duration-300
            disabled:bg-gray-50/50 disabled:text-gray-400 disabled:ring-gray-200
            shadow-sm hover:shadow-md focus:shadow-lg
            ${className}
          `}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? `${inputId}-error` : helpText ? `${inputId}-description` : undefined
          }
          {...props}
        />
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-danger-700 font-medium flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p id={`${inputId}-description`} className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
});

export default Input;
