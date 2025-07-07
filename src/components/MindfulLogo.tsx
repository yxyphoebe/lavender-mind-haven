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
    sm: 1.5,
    md: 2,
    lg: 2.5,
    xl: 3
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient definitions - 严格按照参考图片 */}
        <defs>
          <linearGradient id="ensoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#8B5FE6" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
        
        {/* Enso 圆环 - 严格按照参考图片的形状和开口 */}
        <path
          d="M 60 15 A 45 45 0 1 1 45 95"
          stroke="url(#ensoGradient)"
          strokeWidth={strokeWidth[size] * 2}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* M 字母 - 严格按照参考图片的位置和比例 */}
        <path
          d="M 40 40 L 40 80 M 40 40 L 60 65 L 80 40 M 80 40 L 80 80"
          stroke="url(#ensoGradient)"
          strokeWidth={strokeWidth[size] * 1.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default MindfulLogo;