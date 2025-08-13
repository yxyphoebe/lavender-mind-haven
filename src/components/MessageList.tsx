
import { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
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

interface MessageListProps {
  messages: Message[];
  therapist: {
    name: string;
    image_url?: string;
  };
  isTyping: boolean;
}

const MessageList = ({ messages, therapist, isTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto relative z-10">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex items-start space-x-4 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
              <div className={`flex-1 min-w-0 space-y-2 ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`flex items-center space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <span className="text-sm font-medium text-slate-700">
                    {message.sender === 'ai' ? therapist.name : 'You'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {message.text && (
                  <div className={`rounded-2xl px-4 py-3 shadow-sm border border-white/30 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500/80 to-purple-500/80 text-white backdrop-blur-sm' 
                      : 'bg-white/60 backdrop-blur-sm'
                  }`}>
                    <p className={`leading-relaxed whitespace-pre-wrap text-[15px] ${
                      message.sender === 'user' ? 'text-white' : 'text-slate-700'
                    }`}>
                      {message.text}
                    </p>
                  </div>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <MediaMessage
                        key={index}
                        url={attachment.url}
                        type={attachment.type}
                        className={`rounded-2xl overflow-hidden shadow-sm border border-white/30 ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm' 
                            : 'bg-white/60 backdrop-blur-sm'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start space-x-4 max-w-2xl">
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
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/30 min-w-[120px]">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-3.5 h-3.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3.5 h-3.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
