import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Loader2, User, Plus, Video, X } from 'lucide-react';
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

  // Get persona based on therapist name or default to nuva
  const getPersona = (therapistName: string) => {
    const name = therapistName.toLowerCase();
    if (name.includes('nova')) return 'nova';
    if (name.includes('sage')) return 'sage';
    if (name.includes('lani')) return 'lani';
    if (name.includes('aya')) return 'aya';
    if (name.includes('elias')) return 'elias';
    return 'nuva';
  };

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
      
      const persona = therapist ? getPersona(therapist.name) : 'nuva';
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputValue,
          persona: persona,
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

      {/* Header */}
      <div className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/user-center')}
              className="hover:bg-white/50 rounded-full transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10 ring-2 ring-white/50 shadow-lg">
                  <AvatarImage 
                    src={therapist.image_url || ''} 
                    alt={therapist.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-sm font-medium">
                    {therapist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-lg font-medium text-slate-800">{therapist.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 animate-fade-in">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.sender === 'ai' ? (
                  <Avatar className="w-9 h-9 ring-2 ring-white/50 shadow-md">
                    <AvatarImage 
                      src={therapist.image_url || ''} 
                      alt={therapist.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-sm">
                      {therapist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">
                    {message.sender === 'ai' ? therapist.name : '你'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {message.text && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/30 max-w-2xl">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                      {message.text}
                    </p>
                  </div>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="space-y-2 max-w-2xl">
                    {message.attachments.map((attachment, index) => (
                      <MediaMessage
                        key={index}
                        url={attachment.url}
                        type={attachment.type}
                        className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-white/30"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-4 animate-fade-in">
              <Avatar className="w-9 h-9 ring-2 ring-white/50 shadow-md">
                <AvatarImage 
                  src={therapist.image_url || ''} 
                  alt={therapist.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-sm">
                  {therapist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">{therapist.name}</span>
                  <span className="text-xs text-slate-400">正在输入...</span>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/30">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 bg-white/70 backdrop-blur-xl border-t border-white/30 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Media Uploader - only show selected files preview */}
          {selectedMediaFiles.length > 0 && (
            <div className="mb-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  {selectedMediaFiles.map((mediaFile, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm border border-white/50">
                        {mediaFile.type === 'image' ? (
                          <img
                            src={mediaFile.preview}
                            alt="预览"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <Video className="w-8 h-8 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const newFiles = selectedMediaFiles.filter((_, i) => i !== index);
                          setSelectedMediaFiles(newFiles);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-400/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    size="sm"
                    onClick={async () => {
                      const uploadedUrls: string[] = [];
                      for (const mediaFile of selectedMediaFiles) {
                        const fileExt = mediaFile.file.name.split('.').pop();
                        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                        const filePath = `${fileName}`;

                        const { data, error } = await supabase.storage
                          .from('chat-media')
                          .upload(filePath, mediaFile.file);

                        if (!error) {
                          const { data: { publicUrl } } = supabase.storage
                            .from('chat-media')
                            .getPublicUrl(data.path);
                          uploadedUrls.push(publicUrl);
                        } else {
                          console.error('Upload error:', error);
                        }
                      }
                      handleSendMessage(uploadedUrls);
                    }}
                    disabled={isTyping}
                    className="bg-gradient-to-r from-blue-400/80 to-purple-400/80 hover:from-blue-500/80 hover:to-purple-500/80 text-white rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm"
                  >
                    发送 {selectedMediaFiles.length} 个文件
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Input Box */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-2">
            <div className="flex items-end space-x-3 px-4 py-2">
              {/* Plus button on the left */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*,video/*';
                  input.multiple = true;
                  input.onchange = (e) => {
                    const files = Array.from((e.target as HTMLInputElement).files || []);
                    const mediaFiles: MediaFile[] = [];
                    files.forEach(file => {
                      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                        const preview = URL.createObjectURL(file);
                        const type = file.type.startsWith('image/') ? 'image' : 'video';
                        mediaFiles.push({ file, preview, type });
                      }
                    });
                    const newFiles = [...selectedMediaFiles, ...mediaFiles];
                    setSelectedMediaFiles(newFiles);
                  };
                  input.click();
                }}
                disabled={isTyping}
                className="w-9 h-9 rounded-full hover:bg-white/50 text-slate-500 hover:text-slate-700 transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              {/* Input field */}
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入消息..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-slate-400 px-0 py-2"
                  disabled={isTyping}
                />
              </div>
              
              {/* Voice recorder and send button on the right */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <VoiceRecorder 
                  onTranscriptionComplete={handleVoiceTranscription}
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={(!inputValue.trim() && selectedMediaFiles.length === 0) || isTyping}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-4 py-2 h-9 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
