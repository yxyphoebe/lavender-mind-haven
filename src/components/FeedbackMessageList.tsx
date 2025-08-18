import { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from 'lucide-react';
import MediaMessage from './MediaMessage';
import TypingText from './TypingText';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  hasTypingAnimation?: boolean;
  preDelay?: number;
  attachments?: Array<{
    url: string;
    type: 'image' | 'video';
  }>;
}

interface FeedbackMessageListProps {
  messages: Message[];
  therapist: {
    name: string;
    image_url?: string;
  };
  isTyping: boolean;
}

const FeedbackMessageList = ({ messages, therapist, isTyping }: FeedbackMessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-0 min-h-0">
      <ScrollArea ref={scrollAreaRef} className="flex-1 h-full">
        <div className="px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex items-start max-w-[85%] ${message.sender === 'user' ? '' : 'space-x-3'}`}>
                {/* Avatar - only for AI */}
                {message.sender === 'ai' && (
                  <div className="flex-shrink-0">
                    <Avatar className="w-7 h-7 ring-1 ring-gray-200">
                      <AvatarImage 
                        src={therapist.image_url || ''} 
                        alt={therapist.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                        {therapist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* Message Content */}
                <div className={`flex-1 min-w-0 ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  {message.text && (
                    <div className={`rounded-2xl px-3 py-2 border ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-gray-100 text-slate-700 border-gray-200'
                    }`}>
                      {message.hasTypingAnimation ? (
                        <TypingText
                          text={message.text}
                          preDelay={message.preDelay || 0}
                          speed={35}
                          className="leading-relaxed whitespace-pre-wrap text-sm"
                          clickToSkip={false}
                        />
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap text-sm">
                          {message.text}
                        </p>
                      )}
                    </div>
                  )}

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <MediaMessage
                          key={index}
                          url={attachment.url}
                          type={attachment.type}
                          className={`rounded-2xl overflow-hidden border ${
                            message.sender === 'user' 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-gray-50 border-gray-200'
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
              <div className="flex items-start space-x-3 max-w-[85%]">
                <Avatar className="w-7 h-7 ring-1 ring-gray-200">
                  <AvatarImage 
                    src={therapist.image_url || ''} 
                    alt={therapist.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                    {therapist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2 border border-gray-200">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default FeedbackMessageList;