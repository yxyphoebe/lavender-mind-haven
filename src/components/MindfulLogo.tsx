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
    xl: 6
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
        
        {/* Enso circle (incomplete circle) */}
        <path
          d="M 20 50 A 30 30 0 1 1 80 50"
          stroke="url(#logoGradient)"
          strokeWidth={strokeWidth[size]}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* M letter inside */}
        <path
          d="M 35 35 L 35 65 M 35 35 L 50 50 L 65 35 M 65 35 L 65 65"
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