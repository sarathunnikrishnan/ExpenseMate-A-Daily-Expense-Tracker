/**
 * @file Button.tsx
 * @description Reusable UI Button component supporting primary, secondary, danger, ghost, and outline variants.
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = [
    'inline-flex items-center justify-center font-medium',
    'rounded-lg transition-colors focus:outline-none',
    'focus:ring-2 focus:ring-offset-2',
    'dark:focus:ring-offset-background-dark',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' ');

  const variants = {
    primary: [
      'bg-primary-light dark:bg-primary-dark text-white',
      'hover:opacity-90 focus:ring-primary-light',
    ].join(' '),
    secondary: [
      'bg-gray-200 dark:bg-gray-700 text-gray-900',
      'dark:text-gray-100 hover:bg-gray-300',
      'dark:hover:bg-gray-600 focus:ring-gray-500',
    ].join(' '),
    danger: [
      'bg-red-500 text-white hover:bg-red-600',
      'focus:ring-red-500',
    ].join(' '),
    ghost: [
      'bg-transparent text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'focus:ring-gray-500',
    ].join(' '),
    outline: [
      'border border-gray-300 dark:border-gray-600',
      'text-gray-700 dark:text-gray-300 hover:bg-gray-50',
      'dark:hover:bg-gray-800 focus:ring-gray-500',
    ].join(' '),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const btnClass = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={btnClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="w-5 h-5 mr-2 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d={
                'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291' +
                'A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              }
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
