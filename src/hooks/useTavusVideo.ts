
import { useState, useCallback, useRef } from 'react';
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
  
  // Use ref to prevent multiple concurrent requests
  const requestInProgress = useRef(false);

  const startAudioSession = useCallback(async (therapistName: string) => {
    // Prevent multiple concurrent requests
    if (requestInProgress.current) {
      console.log('Request already in progress, skipping...');
      return session;
    }

    requestInProgress.current = true;
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log('Starting Tavus audio session for:', therapistName);
      
      // Optimized Supabase function call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const { data, error } = await supabase.functions.invoke('tavus-video', {
        body: {
          action: 'create',
          therapistName: therapistName
        }
      });

      clearTimeout(timeoutId);

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
      requestInProgress.current = false;
    }
  }, [toast, session]);

  const endAudioSession = useCallback(async () => {
    if (!session || requestInProgress.current) {
      console.log('No Tavus session to end or request in progress');
      return;
    }

    requestInProgress.current = true;

    try {
      console.log('Ending Tavus session:', session.conversation_id);
      
      // Quick cleanup - don't wait for API response
      const cleanupPromise = supabase.functions.invoke('tavus-video', {
        body: {
          action: 'end',
          conversationId: session.conversation_id
        }
      });

      // Immediate state cleanup for better UX
      setSession(null);
      setIsConnected(false);
      setError(null);
      
      toast({
        title: "AI会话已结束",
        description: "智能语音对话已成功结束"
      });

      // Wait for API cleanup in background
      cleanupPromise.then(({ error }) => {
        if (error) {
          console.error('Error ending Tavus session:', error);
        } else {
          console.log('Tavus session ended successfully');
        }
      }).catch((err) => {
        console.error('Error ending Tavus session:', err);
      });

    } catch (err) {
      console.error('Error ending Tavus session:', err);
    } finally {
      requestInProgress.current = false;
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
