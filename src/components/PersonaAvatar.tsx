
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
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Heart,
      gradient: 'from-rose-400 to-pink-500',
      name: 'Nuva'
    },
    nova: {
      imageUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face',
      fallbackIcon: Sun,
      gradient: 'from-amber-400 to-orange-500',
      name: 'Nova'
    },
    sage: {
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
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
