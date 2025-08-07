
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
      <div className="max-w-md mx-auto flex flex-col min-h-screen relative">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          {/* Therapist Chat Simulation */}
          <div className="mb-16 animate-fade-in">
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
              
              {/* Chat Bubble */}
              <div className="flex-1 max-w-[280px]">
                <div className="glass-effect bg-white/60 backdrop-blur-sm rounded-2xl rounded-tl-sm p-5 zen-shadow border border-white/40">
                  <p className="text-neutral-800 text-base leading-relaxed whitespace-pre-line">
                    {welcomePrompt || `Hey, I've been waiting for you. 🌿\n\nLet's begin gently — how are you feeling today?`}
                  </p>
                </div>
                
                {/* Therapist Name Label */}
                <div className="ml-2 mt-2">
                  <span className="text-xs text-neutral-500 font-medium">{therapist.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Action Buttons */}
        <div className="pb-8 px-6">
          <div className="flex justify-center space-x-6">
            {/* Text Chat Button */}
            <Button
              onClick={() => navigate('/chat')}
              className="w-20 h-20 rounded-2xl glass-effect bg-white/60 backdrop-blur-sm hover:bg-white/70 hover:scale-105 transition-all duration-300 zen-shadow border border-white/40 flex flex-col items-center justify-center space-y-1"
              variant="ghost"
            >
              <MessageCircle className="w-7 h-7 text-mindful-600" />
              <span className="text-xs text-mindful-700 font-medium">Chat</span>
            </Button>
            
            {/* Video Call Button */}
            <Button
              onClick={() => navigate('/video-call')}
              className="w-20 h-20 rounded-2xl glass-effect bg-white/60 backdrop-blur-sm hover:bg-white/70 hover:scale-105 transition-all duration-300 zen-shadow border border-white/40 flex flex-col items-center justify-center space-y-1"
              variant="ghost"
            >
              <Video className="w-7 h-7 text-enso-600" />
              <span className="text-xs text-enso-700 font-medium">Video</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
