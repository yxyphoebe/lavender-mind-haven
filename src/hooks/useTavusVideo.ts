
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
  const [tavusVideoUrl, setTavusVideoUrl] = useState<string | null>(null);
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
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data.success) {
        console.error('API error:', data.error);
        throw new Error(data.error || 'Failed to create conversation');
      }

      const conversationData: TavusConversation = {
        conversation_id: data.conversation_id,
        conversation_url: data.conversation_url,
        status: data.status
      };

      console.log('Conversation created successfully:', conversationData);
      setConversation(conversationData);
      setTavusVideoUrl(conversationData.conversation_url);
      setIsConnected(true);
      
      toast({
        title: "连接成功",
        description: `视频通话已与 ${therapistName} 建立`
      });

      return conversationData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error creating conversation:', errorMessage);
      setError(errorMessage);
      
      toast({
        title: "连接失败",
        description: "无法开始视频通话，请重试",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const endConversation = useCallback(async () => {
    if (!conversation) {
      console.log('No conversation to end');
      return;
    }

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
      } else if (data?.success) {
        console.log('Conversation ended successfully');
        toast({
          title: "通话已结束",
          description: "视频通话已成功结束"
        });
      }
    } catch (err) {
      console.error('Error ending video call:', err);
    } finally {
      // Clean up state regardless of API call success
      setConversation(null);
      setIsConnected(false);
      setTavusVideoUrl(null);
      setError(null);
    }
  }, [conversation, toast]);

  return {
    isConnecting,
    isConnected,
    conversation,
    tavusVideoUrl,
    error,
    createConversation,
    endConversation
  };
};
