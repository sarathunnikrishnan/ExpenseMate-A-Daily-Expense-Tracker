/**
 * @file Card.tsx
 * @description Reusable Card UI subcomponents (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`).
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  const cardClasses =
    `bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-800 ` +
    `rounded-xl shadow-sm overflow-hidden ${className}`;
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-800 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  const footerClasses =
    `px-6 py-4 border-t border-gray-200 dark:border-gray-800 ` +
    `bg-gray-50 dark:bg-gray-900/50 ${className}`;
  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};
