import React from 'react';

interface RadioOption {
  value: string | boolean;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  value: string | boolean;
  options: RadioOption[];
  onChange: (value: string | boolean) => void;
  error?: string;
  helpText?: string;
  orientation?: 'horizontal' | 'vertical';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  helpText,
  orientation = 'horizontal'
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3">
            {label}
          </legend>
          
          <div className={`
            ${orientation === 'horizontal' 
              ? 'flex flex-wrap gap-6' 
              : 'space-y-3'
            }
          `}>
            {options.map((option, index) => {
              const optionId = `${groupId}-${index}`;
              const isSelected = value === option.value;
              
              return (
                <div key={optionId} className="flex items-start">
                  <div className="flex items-center h-6">
                    <input
                      id={optionId}
                      name={name}
                      type="radio"
                      checked={isSelected}
                      disabled={option.disabled}
                      onChange={() => onChange(option.value)}
                      className={`
                        h-4 w-4 border-gray-300 text-blue-600 
                        focus:ring-blue-500 focus:ring-offset-0 focus:ring-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors duration-200
                      `}
                    />
                  </div>
                  <div className="ml-3">
                    <label 
                      htmlFor={optionId}
                      className={`
                        text-sm font-medium cursor-pointer
                        ${option.disabled 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : isSelected 
                            ? 'text-gray-900' 
                            : 'text-gray-700 hover:text-gray-900'
                        }
                        transition-colors duration-200
                      `}
                    >
                      {option.label}
                    </label>
                    {option.description && (
                      <p className={`
                        text-sm mt-1
                        ${option.disabled 
                          ? 'text-gray-300' 
                          : 'text-gray-500'
                        }
                      `}>
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default RadioGroup;
