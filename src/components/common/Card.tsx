import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-pulse-gray border border-pulse-gray-light rounded-lg ${className}`}>
      {title && (
        <div className="px-4 py-5 border-b border-pulse-gray-light sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-white">{title}</h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}