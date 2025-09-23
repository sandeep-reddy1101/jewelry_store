import React, { forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  success?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helpText,
  success,
  className = '',
  ...props
}, ref) => {
  const hasError = !!error;
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            block w-full rounded-lg border-0 py-3 px-4
            text-gray-900 ring-1 ring-inset 
            ${hasError 
              ? 'ring-red-300 focus:ring-red-500' 
              : success 
                ? 'ring-green-300 focus:ring-green-500'
                : 'ring-gray-300 focus:ring-blue-500'
            }
            placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset
            transition-colors duration-200
            disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200
            resize-none
            ${className}
          `}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? `${textareaId}-error` : helpText ? `${textareaId}-description` : undefined
          }
          {...props}
        />
        
        {hasError && (
          <div className="absolute top-3 right-3 pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${textareaId}-error`} className="mt-2 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p id={`${textareaId}-description`} className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
