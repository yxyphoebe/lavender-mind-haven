
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
            <div className={`flex items-start max-w-2xl ${message.sender === 'user' ? '' : 'space-x-4'}`}>
              {/* Avatar - only for AI */}
              {message.sender === 'ai' && (
                <div className="flex-shrink-0">
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
                </div>
              )}

              {/* Message Content */}
              <div className={`flex-1 min-w-0 ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                {message.text && (
                  <div className={`rounded-2xl px-4 py-3 shadow-sm border border-white/30 ${
                    message.sender === 'user' 
                      ? 'bg-slate-200/60 backdrop-blur-sm text-slate-700' 
                      : 'bg-white/60 backdrop-blur-sm'
                  }`}>
                    <p className={`leading-relaxed whitespace-pre-wrap text-[15px] ${
                      message.sender === 'user' ? 'text-slate-700' : 'text-slate-700'
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
              <div className="flex-1">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/30">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
