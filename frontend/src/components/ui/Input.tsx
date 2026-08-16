/**
 * @file Input.tsx
 * @description Reusable form input component with labels, error indicators, and password visibility toggles.
 */

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substr(2, 9);
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = props.type === 'password';
    const currentType = isPasswordType && showPassword ? 'text' : props.type;

    const btnClasses =
      'absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 ' +
      'hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark 
              text-text-light dark:text-text-dark transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'}
              ${isPasswordType ? 'pr-10' : ''}
              ${className}`}
            {...props}
            type={currentType}
          />
          {isPasswordType && (
            <button
              type="button"
              className={btnClasses}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
