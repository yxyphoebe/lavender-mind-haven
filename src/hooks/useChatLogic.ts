
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useChatLogic = (selectedTherapistId: string, therapist: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user and load chat history
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
        await loadChatHistory(session.user.id);
      }
    };

    getCurrentUser();
  }, [selectedTherapistId]);

  // Load chat history from database
  const loadChatHistory = async (userId: string) => {
    try {
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .eq('therapist_id', selectedTherapistId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      if (chats && chats.length > 0) {
        const formattedMessages: Message[] = chats.map(chat => ({
          id: chat.id,
          text: chat.message,
          sender: chat.message_type as 'user' | 'ai',
          timestamp: new Date(chat.created_at),
          attachments: chat.attachments && Array.isArray(chat.attachments) && chat.attachments.length > 0
            ? chat.attachments.filter(att => att && typeof att === 'object' && 'url' in att && 'type' in att) as Array<{
                url: string;
                type: 'image' | 'video';
              }>
            : undefined
        }));
        setMessages(formattedMessages);
      } else {
        // If no chat history, add welcome message
        if (therapist) {
          const welcomeMessage: Message = {
            id: 'welcome',
            text: `Hello! I'm ${therapist.name}. How can I help you today?`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
          
          // Save welcome message to database
          await saveMessageToDatabase(welcomeMessage, userId);
        }
      }
    } catch (error) {
      console.error('Error in loadChatHistory:', error);
    }
  };

  // Save message to database
  const saveMessageToDatabase = async (message: Message, userId: string) => {
    if (!userId || message.id === 'welcome') return;

    try {
      const { error } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          therapist_id: selectedTherapistId || null,
          message: message.text,
          message_type: message.sender,
          attachments: message.attachments || []
        });

      if (error) {
        console.error('Error saving message:', error);
      }
    } catch (error) {
      console.error('Error in saveMessageToDatabase:', error);
    }
  };

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

  const handleSendMessage = async (mediaUrls: string[] = []) => {
    if (!inputValue.trim() && mediaUrls.length === 0) return;
    if (!currentUserId) return;

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
    setIsTyping(true);

    // Save user message to database
    await saveMessageToDatabase(userMessage, currentUserId);

    try {
      console.log('Calling AI chat function...');
      
      const persona = therapist ? getPersona(therapist.name) : 'nuva';
      
      // Prepare chat history for AI context
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputValue,
          persona: persona,
          attachments: attachments,
          chatHistory: chatHistory
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
      
      // Save AI message to database
      await saveMessageToDatabase(aiMessage, currentUserId);

    } catch (error) {
      console.error('Error calling AI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to database
      await saveMessageToDatabase(errorMessage, currentUserId);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    handleSendMessage
  };
};
