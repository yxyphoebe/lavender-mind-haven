import { useState, useEffect, useCallback } from 'react';
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

interface FeedbackConversationPair {
  user_message: string;
  ai_message: string;
  user_attachments?: string[];
  timestamp: string;
}

interface LocalFeedbackData {
  messages: Message[];
  feedbackId?: string;
}

export const useFeedbackChatLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  const saveToLocalStorage = useCallback((data: LocalFeedbackData, currentUserId: string) => {
    if (currentUserId) {
      const serializedData = {
        ...data,
        messages: data.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }))
      };
      localStorage.setItem(`feedback_chat_${currentUserId}`, JSON.stringify(serializedData));
    }
  }, []);

  const loadFromLocalStorage = useCallback((currentUserId: string): LocalFeedbackData | null => {
    if (!currentUserId) return null;
    
    const stored = localStorage.getItem(`feedback_chat_${currentUserId}`);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      messages: parsed.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
  }, []);

  const createNewFeedbackSession = async (currentUserId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .insert({
          user_id: currentUserId,
          conversation: [],
          feedback_category: 'general'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating feedback session:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error creating feedback session:', error);
      return null;
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadChatHistory(user.id);
      }
    };

    getCurrentUser();
  }, [loadFromLocalStorage]);

  const initializeChatWithContext = useCallback((initialMessage: string) => {
    if (!userId) return;

    const stored = loadFromLocalStorage(userId);
    if (stored && stored.messages.length > 0) {
      setMessages(stored.messages);
      setFeedbackId(stored.feedbackId || null);
    } else {
      const welcomeMessage: Message = {
        id: `ai-${Date.now()}`,
        text: initialMessage,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages([welcomeMessage]);
      
      const newData: LocalFeedbackData = {
        messages: [welcomeMessage],
        feedbackId: null
      };
      
      saveToLocalStorage(newData, userId);
    }
  }, [userId, loadFromLocalStorage, saveToLocalStorage]);

  const loadChatHistory = useCallback((currentUserId: string) => {
    const stored = loadFromLocalStorage(currentUserId);
    if (stored) {
      setMessages(stored.messages);
      setFeedbackId(stored.feedbackId || null);
    }
  }, [loadFromLocalStorage]);

  const saveFeedbackConversation = async (
    conversationPair: FeedbackConversationPair,
    currentFeedbackId: string,
    allMessages: Message[]
  ) => {
    try {
      const conversationData = allMessages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        attachments: msg.attachments?.map(att => att.url) || []
      }));

      const { error } = await supabase
        .from('feedbacks')
        .update({
          conversation: conversationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentFeedbackId);

      if (error) {
        console.error('Error saving feedback conversation:', error);
      }
    } catch (error) {
      console.error('Error saving feedback conversation:', error);
    }
  };

  const handleSendMessage = useCallback(async (attachments?: string[]) => {
    if (!inputValue.trim() && (!attachments || attachments.length === 0)) return;
    if (!userId) return;
    setIsTyping(true);

    let currentFeedbackId = feedbackId;
    if (!currentFeedbackId) {
      currentFeedbackId = await createNewFeedbackSession(userId);
      if (!currentFeedbackId) {
        setIsTyping(false);
        return;
      }
      setFeedbackId(currentFeedbackId);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments?.map(url => ({
        url,
        type: url.includes('.mp4') || url.includes('.mov') ? 'video' as const : 'image' as const
      })) || []
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');

    const localData: LocalFeedbackData = {
      messages: updatedMessages,
      feedbackId: currentFeedbackId
    };
    saveToLocalStorage(localData, userId);

    try {
      console.log('Sending message to AI:', inputValue);
      console.log('Attachments:', attachments);
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputValue,
          therapistData: {
            name: 'Assistant',
            background_story: 'I am a helpful assistant designed to collect and process user feedback about the application. I listen carefully to user concerns, suggestions, and experiences to help improve the service.',
            style: 'I am empathetic, professional, and focused on understanding user needs. I ask clarifying questions when needed and provide helpful responses while maintaining a supportive tone.'
          },
          attachments: attachments?.map(url => ({
            url,
            type: url.includes('.mp4') || url.includes('.mov') ? 'video' : 'image'
          })) || []
        }
      });

      if (error) {
        console.error('Error calling AI chat function:', error);
        throw error;
      }

      console.log('AI response data:', data);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response || data.message || 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const finalLocalData: LocalFeedbackData = {
        messages: finalMessages,
        feedbackId: currentFeedbackId
      };
      saveToLocalStorage(finalLocalData, userId);

      const conversationPair: FeedbackConversationPair = {
        user_message: inputValue,
        ai_message: aiMessage.text,
        user_attachments: attachments,
        timestamp: userMessage.timestamp.toISOString()
      };

      await saveFeedbackConversation(conversationPair, currentFeedbackId, finalMessages);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        text: 'I apologize, but I encountered an error processing your message. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      };

      const errorMessages = [...updatedMessages, errorMessage];
      setMessages(errorMessages);

      const errorLocalData: LocalFeedbackData = {
        messages: errorMessages,
        feedbackId: currentFeedbackId
      };
      saveToLocalStorage(errorLocalData, userId);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, messages, userId, feedbackId, saveToLocalStorage]);

  const clearChatHistory = useCallback(() => {
    if (!userId) return;
    localStorage.removeItem(`feedback_chat_${userId}`);
    setMessages([]);
    setFeedbackId(null);
  }, [userId]);

  return {
    messages,
    inputValue,
    isTyping,
    setInputValue,
    handleSendMessage,
    clearChatHistory,
    initializeChatWithContext
  };
};