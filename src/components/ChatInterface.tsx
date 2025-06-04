import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Heart, Zap, Star, Menu, Video, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm so glad you're here. How are you feeling today? Take your time - there's no rush.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get selected persona from localStorage
  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  
  const personas = {
    nuva: { name: 'Nuva', icon: Heart, color: 'rose' },
    nova: { name: 'Nova', icon: Zap, color: 'lavender' },
    sage: { name: 'Sage', icon: Star, color: 'sage' }
  };

  const currentPersona = personas[selectedPersona as keyof typeof personas] || personas.nuva;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I hear you, and I want you to know that what you're feeling is completely valid. Would you like to explore this feeling a bit more together?",
        "Thank you for sharing that with me. It takes courage to open up. How has this been affecting your daily life?",
        "I'm here to support you through this. Let's take a moment to breathe together. What would feel most helpful for you right now?",
        "That sounds like a really challenging experience. You're being so brave by talking about it. What do you think might help you feel more grounded?",
        "I can sense the strength in your words, even through the difficulty. What small step could we take together today?"
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const IconComponent = currentPersona.icon;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/menu')}
            className="hover:bg-slate-100 rounded-xl"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </Button>
          
          <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600">
            <AvatarFallback className="bg-transparent">
              <IconComponent className="w-6 h-6 text-white" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {currentPersona.name}
            </h2>
            <p className="text-sm text-slate-500">
              {isTyping ? 'Typing...' : 'Here to support you'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/video-call')}
            className="hover:bg-slate-100 rounded-xl"
          >
            <Video className="w-5 h-5 text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/growth')}
            className="hover:bg-slate-100 rounded-xl"
          >
            <TrendingUp className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
              {message.sender === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="bg-transparent">
                      <IconComponent className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">{currentPersona.name}</span>
                </div>
              )}
              
              <Card className={`p-4 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-4'
                  : 'bg-white border-slate-200 mr-4 shadow-md'
              }`}>
                <p className={`leading-relaxed ${
                  message.sender === 'user' ? 'text-white' : 'text-slate-700'
                }`}>
                  {message.text}
                </p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </Card>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[80%]">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
                  <AvatarFallback className="bg-transparent">
                    <IconComponent className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">{currentPersona.name}</span>
              </div>
              <Card className="p-4 bg-white border-slate-200 mr-4 shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 h-12 border-slate-200 rounded-2xl focus:ring-blue-400 bg-white/80"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl p-0 transition-all duration-300 hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
