
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface TavusConversation {
  conversation_id: string;
  conversation_url: string;
  status: string;
}

export const useTavusVideo = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversation, setConversation] = useState<TavusConversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createConversation = useCallback(async (therapistName: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log('Creating Tavus conversation for:', therapistName);
      
      const { data, error } = await supabase.functions.invoke('tavus-video', {
        body: {
          action: 'create',
          therapistName
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create conversation');
      }

      const conversationData: TavusConversation = {
        conversation_id: data.conversation_id,
        conversation_url: data.conversation_url,
        status: data.status
      };

      setConversation(conversationData);
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: `Video call started with ${therapistName}`
      });

      return conversationData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      toast({
        title: "Connection Failed",
        description: "Unable to start video call. Please try again.",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const endConversation = useCallback(async () => {
    if (!conversation) return;

    try {
      console.log('Ending Tavus conversation:', conversation.conversation_id);
      
      const { data, error } = await supabase.functions.invoke('tavus-video', {
        body: {
          action: 'end',
          conversationId: conversation.conversation_id
        }
      });

      if (error) {
        console.error('Error ending conversation:', error);
      } else {
        console.log('Conversation ended successfully');
      }
    } catch (err) {
      console.error('Error ending video call:', err);
    } finally {
      // Clean up state regardless of API call success
      setConversation(null);
      setIsConnected(false);
      setError(null);
    }
  }, [conversation]);

  return {
    isConnecting,
    isConnected,
    conversation,
    error,
    createConversation,
    endConversation
  };
};
