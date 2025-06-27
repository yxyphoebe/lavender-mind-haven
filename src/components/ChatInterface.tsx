
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
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <p className="text-slate-500 text-sm">正在连接...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <User className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-lg text-slate-600 mb-6 font-light">请选择一位心理顾问开始对话</p>
          <Button 
            onClick={() => navigate('/persona-selection')} 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            选择顾问
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
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
