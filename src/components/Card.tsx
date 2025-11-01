import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-white 
        rounded-3xl 
        border 
        border-gray-200 
        p-6 
        shadow-lg 
        transition-all 
        duration-300 
        ${className}
      `}
    >
      {children}
    </div>
  );
}