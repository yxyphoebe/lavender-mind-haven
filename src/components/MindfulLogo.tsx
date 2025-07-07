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

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="/lovable-uploads/e5145042-25e5-46f0-9113-483ac08026d6.png"
        alt="Mindful AI Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MindfulLogo;