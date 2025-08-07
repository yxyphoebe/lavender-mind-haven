
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

  if (isMobile) {
    return (
      <div 
        className="h-screen safe-area-top safe-area-bottom flex flex-col relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${therapist.background_image_url || therapist.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Top Section - Profile Button */}
        <div className="flex justify-end p-6 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 transition-all duration-300"
          >
            <User className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Middle Section - Avatar and Dialogue */}
        <div className="flex-1 flex items-start justify-start px-4 pt-8">
          <div className="flex items-center space-x-4 animate-fade-in">
            {/* Therapist Avatar */}
            <div className="relative">
              <Avatar className="w-16 h-16 border-4 border-white/30 shadow-lg">
                <AvatarImage 
                  src={therapist.image_url} 
                  alt={therapist.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                  {therapist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Dialogue Bubble */}
            <div className="relative max-w-xs">
              <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg before:content-[''] before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[12px] before:border-t-transparent before:border-b-[12px] before:border-b-transparent before:border-r-[12px] before:border-r-white/20">
                <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                  {welcomePrompt || `我一直在这里，准备好陪你慢慢聊聊了。🌿`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Action Buttons with Clear Boundary */}
        <div className="flex-shrink-0 relative">
          {/* Visual Bottom Boundary */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          {/* Bottom Container */}
          <div className="bg-black/20 backdrop-blur-sm border-t border-white/20">
            <div className="flex justify-center items-center space-x-8 py-8 px-4">
              {/* Chat Button */}
              <Button
                onClick={() => navigate('/chat')}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full w-20 h-20 flex flex-col items-center justify-center"
                variant="ghost"
              >
                <MessageCircle className="w-6 h-6 text-white mb-1" />
                <span className="text-sm text-white font-medium">Chat</span>
              </Button>
              
              {/* Video Button */}
              <Button
                onClick={() => navigate('/video-call')}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full w-20 h-20 flex flex-col items-center justify-center"
                variant="ghost"
              >
                <Video className="w-6 h-6 text-white mb-1" />
                <span className="text-sm text-white font-medium">Video</span>
              </Button>
            </div>
            <div className="safe-area-bottom"></div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div 
      className="min-h-screen safe-area-top safe-area-bottom relative"
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
      <div className="h-full flex items-start justify-start px-8 pt-[20vh]">
        {/* Left Side - Avatar and Dialogue */}
        <div className="flex items-center space-x-6 animate-fade-in">
          {/* Therapist Avatar */}
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/30 shadow-lg">
              <AvatarImage 
                src={therapist.image_url} 
                alt={therapist.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                {therapist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Dialogue Bubble */}
          <div className="relative max-w-md">
            <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg before:content-[''] before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[12px] before:border-t-transparent before:border-b-[12px] before:border-b-transparent before:border-r-[12px] before:border-r-white/20">
              <p className="text-white text-base leading-relaxed whitespace-pre-line">
                {welcomePrompt || `我一直在这里，准备好陪你慢慢聊聊了。🌿`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4">
          {/* Chat Button */}
          <Button
            onClick={() => navigate('/chat')}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full w-16 h-16 flex flex-col items-center justify-center"
            variant="ghost"
          >
            <MessageCircle className="w-5 h-5 text-white mb-1" />
            <span className="text-xs text-white font-medium">Chat</span>
          </Button>
          
          {/* Video Button */}
          <Button
            onClick={() => navigate('/video-call')}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full w-16 h-16 flex flex-col items-center justify-center"
            variant="ghost"
          >
            <Video className="w-5 h-5 text-white mb-1" />
            <span className="text-xs text-white font-medium">Video</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
