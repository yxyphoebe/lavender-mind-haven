import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Heart, Zap, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import VoiceRecorder from './VoiceRecorder';

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
    nuva: { name: 'Nuva', icon: Heart, color: 'violet' },
    nova: { name: 'Nova', icon: Zap, color: 'blue' },
    sage: { name: 'Sage', icon: Star, color: 'indigo' }
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

    try {
      console.log('Calling AI chat function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputValue,
          persona: selectedPersona
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

  const IconComponent = currentPersona.icon;

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
          
          <Avatar className={`w-10 h-10 bg-gradient-to-br ${
            currentPersona.color === 'blue' 
              ? 'from-blue-400 to-blue-500' 
              : currentPersona.color === 'violet' 
                ? 'from-violet-400 to-violet-500'
                : 'from-indigo-400 to-indigo-500'
          }`}>
            <AvatarFallback className="bg-transparent">
              <IconComponent className="w-6 h-6 text-white" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-800">
              {currentPersona.name}
            </h2>
            <p className="text-sm text-slate-500">
              {isTyping ? 'Typing...' : 'Here to support you'}
            </p>
          </div>
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
                  <Avatar className={`w-8 h-8 bg-gradient-to-br ${
                    currentPersona.color === 'blue' 
                      ? 'from-blue-400 to-blue-500' 
                      : currentPersona.color === 'violet' 
                        ? 'from-violet-400 to-violet-500'
                        : 'from-indigo-400 to-indigo-500'
                  }`}>
                    <AvatarFallback className="bg-transparent">
                      <IconComponent className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">{currentPersona.name}</span>
                </div>
              )}
              
              <Card className={`p-4 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white ml-4'
                  : 'bg-white border-violet-200 mr-4 zen-shadow'
              }`}>
                <p className={`leading-relaxed ${
                  message.sender === 'user' ? 'text-white' : 'text-slate-700'
                }`}>
                  {message.text}
                </p>
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
            <div className="max-w-[80%]">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className={`w-8 h-8 bg-gradient-to-br ${
                  currentPersona.color === 'blue' 
                    ? 'from-blue-400 to-blue-500' 
                    : currentPersona.color === 'violet' 
                      ? 'from-violet-400 to-violet-500'
                      : 'from-indigo-400 to-indigo-500'
                }`}>
                  <AvatarFallback className="bg-transparent">
                    <IconComponent className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">{currentPersona.name}</span>
              </div>
              <Card className="p-4 bg-white border-violet-200 mr-4 zen-shadow">
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
      <div className="p-4 glass-effect border-t border-violet-200">
        <div className="flex items-center space-x-3">
          <VoiceRecorder 
            onTranscriptionComplete={handleVoiceTranscription}
            disabled={isTyping}
          />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="说话或输入文字..."
            className="flex-1 h-12 border-violet-200 rounded-2xl focus:ring-violet-400 bg-white/80"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="h-12 w-12 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-2xl p-0 transition-all duration-300 hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
