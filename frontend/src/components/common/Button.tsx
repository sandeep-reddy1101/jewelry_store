import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'gold' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  icon,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-glow-primary focus:ring-primary-400 shadow-modern hover:shadow-elegant font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:shadow-modern focus:ring-secondary-400 shadow-soft hover:shadow-elegant font-medium hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300',
    danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white hover:shadow-modern focus:ring-danger-400 shadow-soft hover:shadow-elegant font-medium hover:from-danger-600 hover:to-danger-700 transition-all duration-300',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:shadow-modern focus:ring-success-400 shadow-soft hover:shadow-elegant font-medium hover:from-success-600 hover:to-success-700 transition-all duration-300',
    gold: 'bg-gradient-to-r from-jewelry-gold to-jewelry-gold-accent text-gray-900 hover:shadow-glow-gold focus:ring-jewelry-gold-accent shadow-modern hover:shadow-elegant font-semibold transition-all duration-300',
    outline: 'btn-outline focus:ring-blue-400 shadow-soft font-medium',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
