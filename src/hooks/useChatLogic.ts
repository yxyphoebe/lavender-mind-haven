
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

interface ConversationPair {
  user_message: string;
  ai_response: string;
  timestamp: string;
  user_attachments?: Array<{
    url: string;
    type: 'image' | 'video';
  }>;
}

interface LocalChatData {
  therapistId: string;
  messages: Message[];
  lastUpdated: string;
}

export const useChatLogic = (selectedTherapistId: string, therapist: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Local storage keys
  const getLocalStorageKey = (userId: string, therapistId: string) => 
    `chat_${userId}_${therapistId}`;

  // Save messages to local storage
  const saveToLocalStorage = (userId: string, therapistId: string, messages: Message[]) => {
    try {
      const chatData: LocalChatData = {
        therapistId,
        messages,
        lastUpdated: new Date().toISOString()
      };
      const key = getLocalStorageKey(userId, therapistId);
      localStorage.setItem(key, JSON.stringify(chatData));
      console.log('Chat saved to local storage');
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  // Load messages from local storage
  const loadFromLocalStorage = (userId: string, therapistId: string): Message[] => {
    try {
      const key = getLocalStorageKey(userId, therapistId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const chatData: LocalChatData = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return chatData.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
    return [];
  };

  // Create a new chat session when component mounts
  const createNewChatSession = async (userId: string) => {
    try {
      console.log('Creating new chat session for user:', userId, 'therapist:', selectedTherapistId);
      
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          therapist_id: selectedTherapistId || null,
          conversation: [] as any,
          conversation_started_at: new Date().toISOString(),
          attachments: []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating new chat session:', error);
        return null;
      }

      console.log('New chat session created:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error in createNewChatSession:', error);
      return null;
    }
  };

  // Get current user and initialize chat session
  useEffect(() => {
    const initializeChatSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
        
        // Create new chat session immediately
        const newChatId = await createNewChatSession(session.user.id);
        if (newChatId) {
          setCurrentChatId(newChatId);
        }
        
        // Load historical messages from local storage for display
        await loadChatHistory(session.user.id);
      }
    };

    initializeChatSession();
  }, [selectedTherapistId]);

  // Load chat history from local storage for display only
  const loadChatHistory = async (userId: string) => {
    try {
      // Load from local storage for instant display of historical messages
      const localMessages = loadFromLocalStorage(userId, selectedTherapistId);
      if (localMessages.length > 0) {
        setMessages(localMessages);
        console.log('Loaded historical chat from local storage');
      } else if (therapist) {
        // If no local history, add welcome message
        const welcomeMessage: Message = {
          id: 'welcome',
          text: `Hello! I'm ${therapist.name}. How can I help you today?`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        saveToLocalStorage(userId, selectedTherapistId, [welcomeMessage]);
      }
    } catch (error) {
      console.error('Error in loadChatHistory:', error);
    }
  };

  // Save conversation pair to current chat session
  const saveConversationPair = async (userMessage: string, aiResponse: string, userAttachments?: Array<{url: string; type: 'image' | 'video'}>) => {
    if (!currentUserId || !currentChatId) {
      console.error('No current user or chat session');
      return;
    }

    try {
      const conversationPair: ConversationPair = {
        user_message: userMessage,
        ai_response: aiResponse,
        timestamp: new Date().toISOString(),
        user_attachments: userAttachments
      };

      // Get current conversation from the chat session
      const { data: existingChat } = await supabase
        .from('chats')
        .select('conversation')
        .eq('id', currentChatId)
        .single();

      if (existingChat) {
        const existingConversation = (existingChat.conversation as unknown as ConversationPair[]) || [];
        const updatedConversation = [...existingConversation, conversationPair];

        const { error } = await supabase
          .from('chats')
          .update({ 
            conversation: updatedConversation as any
          })
          .eq('id', currentChatId);

        if (error) {
          console.error('Error updating conversation:', error);
        } else {
          console.log('Conversation updated successfully');
        }
      }
    } catch (error) {
      console.error('Error in saveConversationPair:', error);
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

    // Update messages state immediately
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Save to local storage immediately
    saveToLocalStorage(currentUserId, selectedTherapistId, newMessages);
    
    const currentInputValue = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('Calling AI chat function...');
      
      const persona = therapist ? getPersona(therapist.name) : 'nuva';
      
      // Prepare chat history for AI context (only recent messages to avoid too much context)
      const recentMessages = messages.slice(-10);
      const chatHistory = recentMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInputValue,
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

      const aiResponse = data.response || "I'm sorry, I couldn't process your message right now. Please try again.";
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      // Update messages with AI response
      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      
      // Save updated messages to local storage
      saveToLocalStorage(currentUserId, selectedTherapistId, finalMessages);
      
      // Save the complete conversation pair to current chat session
      await saveConversationPair(currentInputValue, aiResponse, attachments.length > 0 ? attachments : undefined);

    } catch (error) {
      console.error('Error calling AI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      
      // Save error message to local storage
      saveToLocalStorage(currentUserId, selectedTherapistId, finalMessages);
      
      // Save error conversation pair
      await saveConversationPair(currentInputValue, errorMessage.text);
    } finally {
      setIsTyping(false);
    }
  };

  // Function to clear chat history (for user deletion)
  const clearChatHistory = () => {
    if (currentUserId) {
      const key = getLocalStorageKey(currentUserId, selectedTherapistId);
      localStorage.removeItem(key);
      setMessages([]);
      console.log('Chat history cleared from local storage');
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    handleSendMessage,
    clearChatHistory
  };
};
