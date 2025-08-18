import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SimpleMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export const useSimpleFeedbackChat = () => {
  const [messages, setMessages] = useState<SimpleMessage[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you share feedback about your experience with the app. Feel free to tell me about anything you like, any suggestions you have, or any concerns you'd like to discuss.",
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
          therapistData: 'Assistant',
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