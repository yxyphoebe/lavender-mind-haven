
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface TavusSession {
  session_id: string;
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
      console.log('Starting pure audio session with Tavus for:', therapistName);
      
      // 这里可以调用Tavus的纯音频API而不是视频API
      // 暂时模拟会话创建
      const mockSession: TavusSession = {
        session_id: `audio_session_${Date.now()}`,
        status: 'active'
      };

      console.log('Audio session created successfully:', mockSession);
      setSession(mockSession);
      setIsConnected(true);
      
      toast({
        title: "音频会话已建立",
        description: `与 ${therapistName} 的语音交互已开始`
      });

      return mockSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error creating audio session:', errorMessage);
      setError(errorMessage);
      
      toast({
        title: "连接失败",
        description: "无法开始语音会话，请重试",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const endAudioSession = useCallback(async () => {
    if (!session) {
      console.log('No session to end');
      return;
    }

    try {
      console.log('Ending audio session:', session.session_id);
      
      // 这里可以调用结束会话的API
      console.log('Audio session ended successfully');
      
      toast({
        title: "会话已结束",
        description: "语音会话已成功结束"
      });
    } catch (err) {
      console.error('Error ending audio session:', err);
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
