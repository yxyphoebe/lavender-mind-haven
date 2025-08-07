
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
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col items-center justify-center px-6">
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

        {/* Floating Dialog Container */}
        <div className="w-full max-w-sm animate-fade-in">
          {/* Chat Dialog */}
          <div className="glass-effect bg-white/40 backdrop-blur-xl rounded-3xl p-6 zen-shadow border border-white/30 animate-gentle-float">
            <div className="flex items-start space-x-4">
              {/* Therapist Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-14 h-14 zen-shadow">
                  <AvatarImage 
                    src={therapist.image_url || ''} 
                    alt={`${therapist.name} avatar`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-mindful-400 to-enso-500 text-white text-lg">
                    {therapist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Message Bubble */}
              <div className="flex-1">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl rounded-tl-md p-4 border border-white/30">
                  <p className="text-neutral-800 text-sm leading-relaxed whitespace-pre-line">
                    {welcomePrompt || `我一直在这里，准备好陪你慢慢聊聊了。🌿`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Below Dialog */}
          <div className="flex justify-center space-x-4 mt-6">
            {/* Chat Button */}
            <Button
              onClick={() => navigate('/chat')}
              className="bg-white/30 backdrop-blur-sm hover:bg-white/40 hover:scale-105 transition-all duration-300 zen-shadow border border-white/20 rounded-2xl w-16 h-16 flex flex-col items-center justify-center"
              variant="ghost"
            >
              <MessageCircle className="w-6 h-6 text-mindful-600 mb-1" />
              <span className="text-xs text-mindful-700 font-medium">Chat</span>
            </Button>
            
            {/* Video Button */}
            <Button
              onClick={() => navigate('/video-call')}
              className="bg-white/30 backdrop-blur-sm hover:bg-white/40 hover:scale-105 transition-all duration-300 zen-shadow border border-white/20 rounded-2xl w-16 h-16 flex flex-col items-center justify-center"
              variant="ghost"
            >
              <Video className="w-6 h-6 text-enso-600 mb-1" />
              <span className="text-xs text-enso-700 font-medium">Video</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
