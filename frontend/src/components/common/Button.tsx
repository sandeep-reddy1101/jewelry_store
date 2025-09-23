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
  const baseClasses = 'inline-flex items-center justify-center rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-modern-primary text-white hover:shadow-glow-primary focus:ring-primary-400 shadow-modern hover:shadow-elegant font-semibold',
    secondary: 'bg-modern-secondary text-white hover:shadow-modern focus:ring-secondary-400 shadow-soft hover:shadow-elegant font-medium',
    danger: 'bg-modern-danger text-white hover:shadow-modern focus:ring-danger-400 shadow-soft hover:shadow-elegant font-medium',
    success: 'bg-modern-success text-white hover:shadow-modern focus:ring-success-400 shadow-soft hover:shadow-elegant font-medium',
    gold: 'bg-jewelry-gold text-gray-900 hover:shadow-glow-gold focus:ring-jewelry-gold-accent shadow-modern hover:shadow-elegant font-semibold',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-400 bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-modern font-medium',
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
