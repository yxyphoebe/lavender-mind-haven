import { Button } from '@/components/ui/button';
import { MessageCircle, Video, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useWelcomePrompt } from '@/hooks/useWelcomePrompt';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useUserCenterMessage, trackNavigation } from '@/hooks/useUserCenterMessage';
import TypingText from '@/components/TypingText';
import BackgroundMusic from '@/components/BackgroundMusic';
import { useEffect } from 'react';

const UserCenter = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, initialized } = useAuth();

  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist, isLoading } = useTherapist(selectedTherapistId);
  const { welcomePrompt, isLoading: promptLoading } = useWelcomePrompt(selectedTherapistId);

  // Smart message system based on navigation context
  const { message: contextualMessage, isLoading: messageLoading, source, status } = useUserCenterMessage(
    initialized && user ? selectedTherapistId : '',
    therapist?.name
  );

  // Track this route for navigation context
  useEffect(() => {
    trackNavigation('/user-center');
  }, []);

  // Only show loading if we have no data at all
  if (!initialized || (!therapist && isLoading)) {
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${therapist.background_image_url || therapist.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background music player (autoplays, low volume, loops). If blocked, shows a small play button */}
      <BackgroundMusic url={therapist.background_music_url || undefined} />

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
      <div className={`h-full flex items-start justify-start px-4 md:px-8 ${isMobile ? 'pt-28' : 'pt-[30vh]'}`}>
        {/* Left Side - Avatar and Dialogue */}
        <div className={`flex items-start ${isMobile ? 'space-x-4' : 'space-x-6'}`}>
          {/* Therapist Avatar */}
          <div className="relative">
            <Avatar className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} border-4 border-white/30 shadow-lg transition-all duration-500`}>
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
          <div className={`relative ${isMobile ? 'max-w-xs' : 'max-w-md'} transition-all duration-500`}>
            <div className={`bg-white/20 backdrop-blur-md rounded-2xl ${isMobile ? 'p-4' : 'p-6'} border border-white/30 shadow-lg`}>
              {status === 'generating' ? (
                <div className={`text-white ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed flex items-center space-x-2`}>
                  <span>...</span>
                </div>
              ) : contextualMessage ? (
                <TypingText
                  text={contextualMessage}
                  preDelay={source === 'session_summary' ? 300 : 700}
                  speed={30}
                  className={`text-white ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed whitespace-pre-line`}
                  clickToSkip
                />
              ) : (
                <p className={`text-white ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed whitespace-pre-line`}>
                  {welcomePrompt || "I'm here for you, ready to have a gentle conversation. 🌿"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Center */}
        <div className={`absolute top-[66%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex ${isMobile ? 'space-x-8' : 'space-x-10'} transition-all duration-500`}>
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