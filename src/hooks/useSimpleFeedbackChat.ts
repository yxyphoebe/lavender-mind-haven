import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFeedbackAssistant } from './useAssistants';

interface SimpleMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export const useSimpleFeedbackChat = () => {
  const { data: assistant } = useFeedbackAssistant();
  
  const [messages, setMessages] = useState<SimpleMessage[]>([
    {
      id: '1',
      text: "Hi, I'm here to listen 👋 Share any thoughts or suggestions about your experience.",
      sender: 'ai'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: SimpleMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage.text,
          assistantData: assistant || { 
            name: 'Assistant', 
            system_prompt: 'You are a helpful assistant designed to gather user feedback and provide support.' 
          },
          attachments: []
        }
      });

      if (error) throw error;

      const aiMessage: SimpleMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I could not process your message.',
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: SimpleMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping]);

  return {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    isTyping
  };
};