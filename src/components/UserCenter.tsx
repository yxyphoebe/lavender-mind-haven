
import { Button } from '@/components/ui/button';
import { MessageCircle, Video, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useWelcomePrompt } from '@/hooks/useWelcomePrompt';
import { useIsMobile } from '@/hooks/use-mobile';

const UserCenter = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist, isLoading } = useTherapist(selectedTherapistId);
  const { welcomePrompt, isLoading: promptLoading } = useWelcomePrompt(selectedTherapistId);

  if (isLoading || promptLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mindful-400" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-neutral-600 mb-4">Please select a therapist first</p>
          <Button onClick={() => navigate('/persona-selection')}>
            Choose Therapist
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${isMobile ? 'h-screen' : 'min-h-screen'} safe-area-top safe-area-bottom relative`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${therapist.background_image_url || therapist.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Profile Button - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 transition-all duration-300"
        >
          <User className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Main Content Container */}
      <div className={`h-full flex items-start justify-start px-4 md:px-8 ${isMobile ? 'pt-20' : 'pt-[20vh]'}`}>
        {/* Left Side - Avatar and Dialogue */}
        <div className={`flex items-center ${isMobile ? 'space-x-4' : 'space-x-6'} animate-fade-in`}>
          {/* Therapist Avatar */}
          <div className="relative">
            <Avatar className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} border-4 border-white/30 shadow-lg`}>
              <AvatarImage 
                src={therapist.image_url} 
                alt={therapist.name}
                className="object-cover"
              />
              <AvatarFallback className={`bg-white/20 text-white ${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
                {therapist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Dialogue Bubble */}
          <div className={`relative ${isMobile ? 'max-w-xs' : 'max-w-md'}`}>
            <div className={`relative bg-white/20 backdrop-blur-md rounded-2xl ${isMobile ? 'p-4' : 'p-6'} border border-white/30 shadow-lg before:content-[''] before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[12px] before:border-t-transparent before:border-b-[12px] before:border-b-transparent before:border-r-[12px] before:border-r-white/20`}>
              <p className={`text-white ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed whitespace-pre-line`}>
                {welcomePrompt || `我一直在这里，准备好陪你慢慢聊聊了。🌿`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Center */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex ${isMobile ? 'space-x-6' : 'space-x-4'}`}>
          {/* Chat Button */}
          <Button
            onClick={() => navigate('/chat')}
            className={`bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full ${isMobile ? 'w-20 h-20' : 'w-16 h-16'} flex flex-col items-center justify-center`}
            variant="ghost"
          >
            <MessageCircle className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-white mb-1`} />
            <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-white font-medium`}>Chat</span>
          </Button>
          
          {/* Video Button */}
          <Button
            onClick={() => navigate('/video-call')}
            className={`bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full ${isMobile ? 'w-20 h-20' : 'w-16 h-16'} flex flex-col items-center justify-center`}
            variant="ghost"
          >
            <Video className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-white mb-1`} />
            <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-white font-medium`}>Video</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
