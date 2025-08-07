
import { Button } from '@/components/ui/button';
import { MessageCircle, Video, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useWelcomePrompt } from '@/hooks/useWelcomePrompt';

const UserCenter = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 safe-area-top safe-area-bottom">
      <div className="mx-4 min-h-screen relative flex flex-col items-center justify-center">
        {/* Profile Button - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full glass-effect hover:bg-white/30 zen-shadow"
          >
            <User className="w-5 h-5 text-neutral-600" />
          </Button>
        </div>

        {/* Large Vertical Dialog Container */}
        <div className="w-full h-[85vh] glass-effect bg-white/30 backdrop-blur-lg rounded-3xl border border-white/20 shadow-md animate-fade-in flex flex-col">
          {/* Upper Half - Chat Dialog */}
          <div 
            className="flex-1 flex items-center justify-center p-8 relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${therapist.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="w-full max-w-lg">
              <div className="flex items-center justify-center">
                {/* Message Bubble with Arrow */}
                <div className="w-full">
                  <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 animate-bubble-appear before:content-[''] before:absolute before:left-[-8px] before:top-6 before:w-0 before:h-0 before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent before:border-r-[8px] before:border-r-white/20">
                    <p className="text-white text-base leading-relaxed whitespace-pre-line">
                      {welcomePrompt || `我一直在这里，准备好陪你慢慢聊聊了。🌿`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Moved to background area */}
            <div className="absolute bottom-8 right-8 flex space-x-4">
              {/* Chat Button */}
              <Button
                onClick={() => navigate('/chat')}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full w-16 h-16 flex flex-col items-center justify-center animate-gentle-float-ultra-slow"
                variant="ghost"
              >
                <MessageCircle className="w-5 h-5 text-white mb-1" />
                <span className="text-xs text-white font-medium">Chat</span>
              </Button>
              
              {/* Video Button */}
              <Button
                onClick={() => navigate('/video-call')}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 rounded-full w-16 h-16 flex flex-col items-center justify-center animate-gentle-float-ultra-slow"
                variant="ghost"
                style={{ animationDelay: '15s' }}
              >
                <Video className="w-5 h-5 text-white mb-1" />
                <span className="text-xs text-white font-medium">Video</span>
              </Button>
            </div>
          </div>

          {/* Lower Half - Empty space for cleaner layout */}
          <div className="flex-1">
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
