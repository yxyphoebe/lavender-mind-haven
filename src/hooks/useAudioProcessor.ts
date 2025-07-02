
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
  const processIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // 开始录音处理
  const startAudioProcessing = useCallback(async (stream: MediaStream) => {
    try {
      console.log('Starting audio processing...');
      
      // 检查浏览器支持的音频格式
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus'
      ];

      let selectedMimeType = '';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          console.log('Using audio format:', type);
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error('No supported audio format found');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('MediaRecorder stopped, processing audio...');
        await processAudioChunks();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast({
          title: "录音错误",
          description: "音频录制过程中出现错误",
          variant: "destructive"
        });
      };

      // 每3秒处理一次音频，给用户更多时间说话
      const processInterval = setInterval(() => {
        if (mediaRecorder.state === 'recording' && audioChunksRef.current.length > 0) {
          console.log('Stopping recorder for processing...');
          mediaRecorder.stop();
        }
      }, 3000);

      processIntervalRef.current = processInterval;
      mediaRecorder.start(1000); // 每秒收集一次数据
      setIsConnected(true);
      
      console.log('Audio processing started successfully');
      
      return () => {
        console.log('Cleaning up audio processing...');
        if (processIntervalRef.current) {
          clearInterval(processIntervalRef.current);
        }
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Error starting audio processing:', error);
      toast({
        title: "音频处理启动失败",
        description: error instanceof Error ? error.message : "无法启动音频处理",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // 处理音频数据
  const processAudioChunks = async () => {
    if (audioChunksRef.current.length === 0) {
      console.log('No audio chunks to process');
      // 重新开始录音
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
            console.log('Restarting recording...');
            mediaRecorderRef.current.start(1000);
          }
        }, 100);
      }
      return;
    }

    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: audioChunksRef.current[0].type 
      });
      
      console.log('Processing audio blob:', {
        type: audioBlob.type,
        size: audioBlob.size,
        chunks: audioChunksRef.current.length
      });

      // 清空当前音频块，准备下一轮
      audioChunksRef.current = [];

      // 如果音频太小，跳过处理
      if (audioBlob.size < 1000) {
        console.log('Audio blob too small, skipping...');
        setIsProcessing(false);
        // 重新开始录音
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
              mediaRecorderRef.current.start(1000);
            }
          }, 100);
        }
        return;
      }

      // 转换为base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          console.log('Sending audio to voice-to-text service...');
          
          // 发送到语音转文字服务
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });

          if (error) {
            console.error('Voice-to-text service error:', error);
            throw error;
          }

          if (data.text && data.text.trim()) {
            console.log('Transcription successful:', data.text);
            options.onTranscription?.(data.text.trim());
            
            // 发送到AI聊天服务获取回应
            await sendToAI(data.text.trim());
          } else {
            console.log('No text transcribed or empty result');
          }
        } catch (error) {
          console.error('Error processing transcription:', error);
          toast({
            title: "语音识别失败",
            description: "无法识别语音内容，请重试",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
          // 重新开始录音
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
            setTimeout(() => {
              if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
                console.log('Restarting recording after processing...');
                mediaRecorderRef.current.start(1000);
              }
            }, 500);
          }
        }
      };

      reader.onerror = () => {
        console.error('FileReader error');
        setIsProcessing(false);
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
      console.log('Sending to AI chat service:', text);
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: text,
          persona: localStorage.getItem('selectedPersona') || 'nuva'
        }
      });

      if (error) {
        console.error('AI chat service error:', error);
        throw error;
      }

      if (data.response) {
        console.log('AI Response received:', data.response);
        options.onAIResponse?.(data.response);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "AI回应失败",
        description: "无法获取AI回应，请重试",
        variant: "destructive"
      });
    }
  };

  return {
    isProcessing,
    isConnected,
    startAudioProcessing
  };
};
