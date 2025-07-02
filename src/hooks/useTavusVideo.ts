
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TavusSession {
  conversation_id: string;
  conversation_url: string;
  status: string;
}

export const useTavusVideo = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [session, setSession] = useState<TavusSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const startAudioSession = useCallback(async (therapistName: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log('Starting Tavus audio session for:', therapistName);
      
      // 调用Supabase Edge Function创建Tavus会话
      const { data, error } = await supabase.functions.invoke('tavus-video', {
        body: {
          action: 'create',
          therapistName: therapistName
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create Tavus session');
      }

      const tavusSession: TavusSession = {
        conversation_id: data.conversation_id,
        conversation_url: data.conversation_url,
        status: data.status
      };

      console.log('Tavus session created successfully:', tavusSession);
      setSession(tavusSession);
      setIsConnected(true);
      
      toast({
        title: "AI语音会话已建立",
        description: `与 ${therapistName} 的智能对话已开始`
      });

      return tavusSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error creating Tavus session:', errorMessage);
      setError(errorMessage);
      
      toast({
        title: "连接失败",
        description: "无法建立AI语音会话，请重试",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const endAudioSession = useCallback(async () => {
    if (!session) {
      console.log('No Tavus session to end');
      return;
    }

    try {
      console.log('Ending Tavus session:', session.conversation_id);
      
      // 调用Supabase Edge Function结束Tavus会话
      const { data, error } = await supabase.functions.invoke('tavus-video', {
        body: {
          action: 'end',
          conversationId: session.conversation_id
        }
      });

      if (error) {
        console.error('Error ending Tavus session:', error);
      } else if (data.success) {
        console.log('Tavus session ended successfully');
      }
      
      toast({
        title: "AI会话已结束",
        description: "智能语音对话已成功结束"
      });
    } catch (err) {
      console.error('Error ending Tavus session:', err);
    } finally {
      // 清理状态
      setSession(null);
      setIsConnected(false);
      setError(null);
    }
  }, [session, toast]);

  return {
    isConnecting,
    isConnected,
    session,
    error,
    startAudioSession,
    endAudioSession
  };
};
