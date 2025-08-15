
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  therapist: {
    name: string;
    image_url?: string;
  };
}

const ChatHeader = ({ therapist }: ChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/30 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="hover:bg-white/50 rounded-full transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-10 h-10 ring-2 ring-white/50 shadow-lg">
                <AvatarImage 
                  src={therapist.image_url || ''} 
                  alt={therapist.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-sm font-medium">
                  {therapist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-lg font-medium text-slate-800">{therapist.name}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
