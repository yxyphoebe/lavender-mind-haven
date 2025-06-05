
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Zap, Star } from 'lucide-react';

interface PersonaAvatarProps {
  personaId: 'nuva' | 'nova' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PersonaAvatar = ({ personaId, size = 'md', className = '' }: PersonaAvatarProps) => {
  const avatarConfig = {
    nuva: {
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Heart,
      gradient: 'from-rose-400 to-pink-500',
      name: 'Nuva'
    },
    nova: {
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Zap,
      gradient: 'from-blue-400 to-cyan-500',
      name: 'Nova'
    },
    sage: {
      imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Star,
      gradient: 'from-violet-400 to-purple-500',
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
