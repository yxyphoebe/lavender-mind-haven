
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
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-lg">
              <div className="flex items-start space-x-4">
                {/* Therapist Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="w-16 h-16 zen-shadow">
                    <AvatarImage 
                      src={therapist.image_url || ''} 
                      alt={`${therapist.name} avatar`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-mindful-400 to-enso-500 text-white text-xl">
                      {therapist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Message Bubble */}
                <div className="flex-1">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl rounded-tl-md p-6 border border-white/30">
                    <p className="text-neutral-800 text-base leading-relaxed whitespace-pre-line">
                      {welcomePrompt || `我一直在这里，准备好陪你慢慢聊聊了。🌿`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Half - Action Buttons */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex justify-center space-x-8">
              {/* Chat Button */}
              <Button
                onClick={() => navigate('/chat')}
                className="bg-white/40 backdrop-blur-xl hover:bg-white/50 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/30 rounded-full w-24 h-24 flex flex-col items-center justify-center animate-gentle-float-ultra-slow"
                variant="ghost"
              >
                <MessageCircle className="w-7 h-7 text-mindful-600 mb-1" />
                <span className="text-xs text-mindful-700 font-medium">Chat</span>
              </Button>
              
              {/* Video Button */}
              <Button
                onClick={() => navigate('/video-call')}
                className="bg-white/40 backdrop-blur-xl hover:bg-white/50 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/30 rounded-full w-24 h-24 flex flex-col items-center justify-center animate-gentle-float-ultra-slow"
                variant="ghost"
                style={{ animationDelay: '2s' }}
              >
                <Video className="w-7 h-7 text-enso-600 mb-1" />
                <span className="text-xs text-enso-700 font-medium">Video</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
