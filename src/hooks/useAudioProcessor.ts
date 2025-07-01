
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AudioProcessorOptions {
  onTranscription?: (text: string) => void;
  onAIResponse?: (response: string) => void;
}

export const useAudioProcessor = (options: AudioProcessorOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // 开始录音处理
  const startAudioProcessing = useCallback(async (stream: MediaStream) => {
    try {
      // 使用 WAV 格式而不是 webm
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/wav'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await processAudioChunks();
      };

      // 每2秒处理一次音频
      const processInterval = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setTimeout(() => {
            if (mediaRecorder.state === 'inactive') {
              mediaRecorder.start();
            }
          }, 100);
        }
      }, 2000);

      mediaRecorder.start();
      setIsConnected(true);
      
      return () => {
        clearInterval(processInterval);
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Error starting audio processing:', error);
      
      // 如果 WAV 不支持，尝试其他格式
      try {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          await processAudioChunks();
        };

        // 每2秒处理一次音频
        const processInterval = setInterval(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setTimeout(() => {
              if (mediaRecorder.state === 'inactive') {
                mediaRecorder.start();
              }
            }, 100);
          }
        }, 2000);

        mediaRecorder.start();
        setIsConnected(true);
        
        return () => {
          clearInterval(processInterval);
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          setIsConnected(false);
        };
      } catch (fallbackError) {
        console.error('Fallback audio processing also failed:', fallbackError);
        toast({
          title: "音频处理失败",
          description: "无法开始音频处理",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // 处理音频数据
  const processAudioChunks = async () => {
    if (audioChunksRef.current.length === 0) return;

    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: audioChunksRef.current[0].type 
      });
      audioChunksRef.current = [];

      console.log('Processing audio blob:', audioBlob.type, audioBlob.size);

      // 转换为base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          // 发送到语音转文字服务
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });

          if (error) throw error;

          if (data.text && data.text.trim()) {
            console.log('Transcription:', data.text);
            options.onTranscription?.(data.text.trim());
            
            // 发送到AI聊天服务获取回应
            await sendToAI(data.text.trim());
          }
        } catch (error) {
          console.error('Error processing transcription:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error in processAudioChunks:', error);
      setIsProcessing(false);
    }
  };

  // 发送到AI并获取回应
  const sendToAI = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: text,
          persona: localStorage.getItem('selectedPersona') || 'nuva'
        }
      });

      if (error) throw error;

      if (data.response) {
        console.log('AI Response:', data.response);
        options.onAIResponse?.(data.response);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  return {
    isProcessing,
    isConnected,
    startAudioProcessing
  };
};
