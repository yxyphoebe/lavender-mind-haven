import { Button } from '@/components/ui/button';
import { Video, User, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useWelcomePrompt } from '@/hooks/useWelcomePrompt';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useDailyMessage } from '@/hooks/useDailyMessage';
import { useChatLogic } from '@/hooks/useChatLogic';
import BackgroundMusic from '@/components/BackgroundMusic';
import EmbeddedMessageList from './EmbeddedMessageList';
import EmbeddedChatInput from './EmbeddedChatInput';
import { useEffect } from 'react';

const ChatInterface = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, initialized } = useAuth();

  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist, isLoading } = useTherapist(selectedTherapistId);
  const { welcomePrompt, isLoading: promptLoading } = useWelcomePrompt(selectedTherapistId);

  // Only fetch daily messages when logged in and therapistId exists
  const { dailyMessage, isLoading: dailyLoading } = useDailyMessage(
    initialized && user ? selectedTherapistId : ''
  );

  // Chat logic
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    handleSendMessage,
    clearChatHistory,
    initializeChatWithContext
  } = useChatLogic(selectedTherapistId, therapist);

  // Initialize chat with context when component mounts
  useEffect(() => {
    if (therapist && (dailyMessage || welcomePrompt)) {
      const contextMessage = dailyMessage || welcomePrompt || "I'm here for you, ready to have a gentle conversation. 🌿";
      initializeChatWithContext(contextMessage);
    }
  }, [therapist, dailyMessage, welcomePrompt, initializeChatWithContext]);

  if (!initialized || isLoading || promptLoading || dailyLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-mindful-400" />
          <p className="text-neutral-600 text-sm">Connecting...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gradient-to-br from-mindful-50 to-enso-50 backdrop-blur-sm rounded-3xl zen-shadow border border-mindful-200">
          <div className="w-16 h-16 bg-gradient-to-br from-mindful-400 to-enso-500 rounded-full mx-auto mb-6 flex items-center justify-center zen-shadow">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-neutral-700 mb-6 font-light">Please select a therapist to start the conversation</p>
          <Button 
            onClick={() => navigate('/persona-selection')} 
            className="bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white border-0 rounded-full px-8 py-3 zen-shadow transition-all duration-300 hover:scale-105"
          >
            Select Therapist
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

      {/* Chat Interface */}
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          {/* Left - Avatar and Back */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/user-center')}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </Button>
            
            <Avatar className="w-10 h-10 border-2 border-white/30">
              <AvatarImage 
                src={therapist.image_url} 
                alt={therapist.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
                {therapist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-white font-medium text-sm">{therapist.name}</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/70 text-xs">Online</span>
              </div>
            </div>
          </div>

          {/* Right - Video Button */}
          <Button
            onClick={() => navigate('/video-call')}
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 transition-all duration-300"
          >
            <Video className="w-4 h-4 text-white" />
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <EmbeddedMessageList 
            messages={messages}
            therapist={therapist}
            isTyping={isTyping}
          />
          <EmbeddedChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;