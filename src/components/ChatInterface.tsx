
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTherapist } from '@/hooks/useTherapists';
import VoiceRecorder from './VoiceRecorder';
import MediaUploader from './MediaUploader';
import MediaMessage from './MediaMessage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: Array<{
    url: string;
    type: 'image' | 'video';
  }>;
}

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<MediaFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get selected therapist from localStorage
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist, isLoading } = useTherapist(selectedTherapistId);

  // Initialize welcome message when therapist data is loaded
  useEffect(() => {
    if (therapist && messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Hello! I'm ${therapist.name}, so glad you're here. How are you feeling today? Take your time - there's no rush.`,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [therapist, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (mediaUrls: string[] = []) => {
    if (!inputValue.trim() && mediaUrls.length === 0) return;

    const attachments = mediaUrls.map(url => ({
      url,
      type: (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi')) ? 'video' as const : 'image' as const
    }));

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedMediaFiles([]);
    setIsTyping(true);

    try {
      console.log('Calling AI chat function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputValue,
          therapist: therapist?.name || 'AI Assistant',
          attachments: attachments
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI response received:', data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your message right now. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceTranscription = (text: string) => {
    console.log('Voice transcription received:', text);
    setInputValue(text);
  };

  const handleMediaSelect = (files: MediaFile[]) => {
    setSelectedMediaFiles(files);
  };

  const handleUploadComplete = (urls: string[]) => {
    handleSendMessage(urls);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please select a therapist first</p>
          <Button onClick={() => navigate('/persona-selection')}>
            Choose Therapist
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="glass-effect border-b border-violet-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/user-center')}
            className="hover:bg-violet-100 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          
          <Avatar className="w-10 h-10 zen-shadow">
            <AvatarImage 
              src={therapist.image_url || ''} 
              alt={`${therapist.name} avatar`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-violet-400 to-violet-500 text-white">
              {therapist.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-800">
              {therapist.name}
            </h2>
            <p className="text-sm text-slate-500">
              {isTyping ? 'Typing...' : 'Here to support you'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
              {message.sender === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-8 h-8 zen-shadow">
                    <AvatarImage 
                      src={therapist.image_url || ''} 
                      alt={`${therapist.name} avatar`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-violet-400 to-violet-500 text-white">
                      {therapist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">{therapist.name}</span>
                </div>
              )}
              
              <Card className={`p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white ml-4'
                  : 'bg-white border-violet-200 mr-4 zen-shadow'
              }`}>
                {message.text && (
                  <p className={`leading-relaxed text-sm ${
                    message.sender === 'user' ? 'text-white' : 'text-slate-700'
                  }`}>
                    {message.text}
                  </p>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <div className={`${message.text ? 'mt-2' : ''} space-y-2`}>
                    {message.attachments.map((attachment, index) => (
                      <MediaMessage
                        key={index}
                        url={attachment.url}
                        type={attachment.type}
                      />
                    ))}
                  </div>
                )}

                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-violet-100' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </Card>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[85%]">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="w-8 h-8 zen-shadow">
                  <AvatarImage 
                    src={therapist.image_url || ''} 
                    alt={`${therapist.name} avatar`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-violet-400 to-violet-500 text-white">
                    {therapist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">{therapist.name}</span>
              </div>
              <Card className="p-3 bg-white border-violet-200 mr-4 zen-shadow">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 glass-effect border-t border-violet-200 max-w-4xl mx-auto w-full">
        <MediaUploader
          onMediaSelect={handleMediaSelect}
          onUploadComplete={handleUploadComplete}
          disabled={isTyping}
        />
        
        <div className="flex items-center space-x-2 mt-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Speak or type your message..."
            className="flex-1 h-10 border-violet-200 rounded-xl focus:ring-violet-400 bg-white/80 text-sm"
          />
          <VoiceRecorder 
            onTranscriptionComplete={handleVoiceTranscription}
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={(!inputValue.trim() && selectedMediaFiles.length === 0) || isTyping}
            className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-xl p-0 transition-all duration-300 hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
