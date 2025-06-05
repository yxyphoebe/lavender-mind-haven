
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Sun, Flower } from 'lucide-react';

interface PersonaAvatarProps {
  personaId: 'nuva' | 'nova' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PersonaAvatar = ({ personaId, size = 'md', className = '' }: PersonaAvatarProps) => {
  const avatarConfig = {
    nuva: {
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Heart,
      gradient: 'from-rose-400 to-pink-500',
      name: 'Nuva'
    },
    nova: {
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Sun,
      gradient: 'from-amber-400 to-orange-500',
      name: 'Nova'
    },
    sage: {
      imageUrl: 'https://images.unsplash.com/photo-1506629905607-c75b5d3b9822?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Flower,
      gradient: 'from-emerald-400 to-green-500',
      name: 'Sage'
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const config = avatarConfig[personaId];
  const FallbackIcon = config.fallbackIcon;

  return (
    <Avatar className={`${sizeClasses[size]} zen-shadow ${className}`}>
      <AvatarImage 
        src={config.imageUrl} 
        alt={`${config.name} avatar`}
        className="object-cover"
      />
      <AvatarFallback className={`bg-gradient-to-br ${config.gradient} text-white`}>
        <FallbackIcon className="w-1/2 h-1/2" />
      </AvatarFallback>
    </Avatar>
  );
};

export default PersonaAvatar;
