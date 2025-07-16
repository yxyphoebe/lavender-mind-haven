
import { Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { useChatLogic } from '@/hooks/useChatLogic';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatInterface = () => {
  const navigate = useNavigate();

  // Get selected therapist from localStorage
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist, isLoading } = useTherapist(selectedTherapistId);

  // Use the chat logic hook
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    handleSendMessage
  } = useChatLogic(selectedTherapistId, therapist);

  if (isLoading) {
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
    <div className="h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex flex-col relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-mindful-200/20 to-enso-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-enso-200/20 to-mindful-200/20 rounded-full blur-3xl"></div>
      </div>

      <ChatHeader therapist={therapist} />
      <MessageList 
        messages={messages} 
        therapist={therapist} 
        isTyping={isTyping} 
      />
      <ChatInput 
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
      />
    </div>
  );
};

export default ChatInterface;
