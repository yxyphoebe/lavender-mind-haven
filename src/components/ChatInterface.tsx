
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Loader2, Paperclip, User } from 'lucide-react';
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
        text: `Hello! I'm ${therapist.name}. How can I help you today?`,
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
          persona: therapist?.persona || 'nuva',
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
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-lg text-gray-600 mb-6">Please select a therapist to start chatting</p>
          <Button onClick={() => navigate('/persona-selection')} className="bg-black hover:bg-gray-800 text-white">
            Choose Therapist
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/user-center')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={therapist.image_url || ''} 
                alt={therapist.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                {therapist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-medium text-gray-900">{therapist.name}</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.sender === 'ai' ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={therapist.image_url || ''} 
                        alt={therapist.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-blue-500 text-white text-sm">
                        {therapist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.sender === 'ai' ? therapist.name : 'You'}
                    </span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    {message.text && (
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}

                    {message.attachments && message.attachments.length > 0 && (
                      <div className={`${message.text ? 'mt-3' : ''} space-y-2`}>
                        {message.attachments.map((attachment, index) => (
                          <MediaMessage
                            key={index}
                            url={attachment.url}
                            type={attachment.type}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-6">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={therapist.image_url || ''} 
                    alt={therapist.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {therapist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{therapist.name}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Media Uploader */}
          <MediaUploader
            onMediaSelect={handleMediaSelect}
            onUploadComplete={handleUploadComplete}
            disabled={isTyping}
          />
          
          {/* Input Box */}
          <div className="relative mt-2">
            <div className="flex items-end space-x-2 bg-gray-50 rounded-lg p-3">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-base placeholder:text-gray-500 p-0"
                  disabled={isTyping}
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <VoiceRecorder 
                  onTranscriptionComplete={handleVoiceTranscription}
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={(!inputValue.trim() && selectedMediaFiles.length === 0) || isTyping}
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white rounded-md px-3 py-2 h-8"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
