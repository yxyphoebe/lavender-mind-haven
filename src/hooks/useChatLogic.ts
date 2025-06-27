
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

export const useChatLogic = (selectedTherapistId: string, therapist: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

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
        .order('conversation_started_at', { ascending: true });

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      if (chats && chats.length > 0) {
        // Use the most recent chat record
        const latestChat = chats[chats.length - 1];
        setCurrentChatId(latestChat.id);
        
        const conversationPairs = latestChat.conversation as ConversationPair[] || [];
        const formattedMessages: Message[] = [];
        
        conversationPairs.forEach((pair, index) => {
          // Add user message
          formattedMessages.push({
            id: `user-${index}`,
            text: pair.user_message,
            sender: 'user',
            timestamp: new Date(pair.timestamp),
            attachments: pair.user_attachments
          });
          
          // Add AI response
          formattedMessages.push({
            id: `ai-${index}`,
            text: pair.ai_response,
            sender: 'ai',
            timestamp: new Date(pair.timestamp)
          });
        });
        
        setMessages(formattedMessages);
      } else {
        // If no chat history, add welcome message and create new chat record
        if (therapist) {
          const welcomeMessage: Message = {
            id: 'welcome',
            text: `Hello! I'm ${therapist.name}. How can I help you today?`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }
      }
    } catch (error) {
      console.error('Error in loadChatHistory:', error);
    }
  };

  // Save conversation pair to database
  const saveConversationPair = async (userMessage: string, aiResponse: string, userAttachments?: Array<{url: string; type: 'image' | 'video'}>) => {
    if (!currentUserId) return;

    try {
      const conversationPair: ConversationPair = {
        user_message: userMessage,
        ai_response: aiResponse,
        timestamp: new Date().toISOString(),
        user_attachments: userAttachments
      };

      if (currentChatId) {
        // Update existing chat record
        const { data: existingChat } = await supabase
          .from('chats')
          .select('conversation')
          .eq('id', currentChatId)
          .single();

        if (existingChat) {
          const existingConversation = existingChat.conversation as ConversationPair[] || [];
          const updatedConversation = [...existingConversation, conversationPair];

          const { error } = await supabase
            .from('chats')
            .update({ 
              conversation: updatedConversation,
              message: userMessage, // Keep for backward compatibility
              message_type: 'user' // Keep for backward compatibility
            })
            .eq('id', currentChatId);

          if (error) {
            console.error('Error updating conversation:', error);
          }
        }
      } else {
        // Create new chat record
        const { data, error } = await supabase
          .from('chats')
          .insert({
            user_id: currentUserId,
            therapist_id: selectedTherapistId || null,
            conversation: [conversationPair],
            conversation_started_at: new Date().toISOString(),
            message: userMessage, // Keep for backward compatibility
            message_type: 'user', // Keep for backward compatibility
            attachments: userAttachments || []
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating new chat:', error);
        } else if (data) {
          setCurrentChatId(data.id);
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

    setMessages(prev => [...prev, userMessage]);
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

      setMessages(prev => [...prev, aiMessage]);
      
      // Save the complete conversation pair to database
      await saveConversationPair(currentInputValue, aiResponse, attachments.length > 0 ? attachments : undefined);

    } catch (error) {
      console.error('Error calling AI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      // Save error conversation pair
      await saveConversationPair(currentInputValue, errorMessage.text);
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
