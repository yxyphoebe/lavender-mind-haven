import React from 'react';

interface MindfulLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const MindfulLogo: React.FC<MindfulLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const strokeWidth = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C8C6FF" />
            <stop offset="100%" stopColor="#A9D9FF" />
          </linearGradient>
        </defs>
        
        {/* Complete Circle with small gap */}
        <path
          d="M 60 20 A 40 40 0 1 1 58 100 A 40 40 0 0 1 60 20"
          stroke="url(#logoGradient)"
          strokeWidth={strokeWidth[size]}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* M Letter - centered and properly proportioned */}
        <path
          d="M 45 50 L 45 80 M 45 50 L 60 65 L 75 50 M 75 50 L 75 80"
          stroke="url(#logoGradient)"
          strokeWidth={strokeWidth[size]}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default MindfulLogo;