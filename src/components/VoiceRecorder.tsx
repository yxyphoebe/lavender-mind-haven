
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

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
        console.log('Recording stopped, processing audio...');
        setShowWaveform(false);
        await processRecording();
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowWaveform(true);
      
      toast({
        title: "录音开始",
        description: "请开始说话...",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "录音失败",
        description: "无法访问麦克风，请检查权限设置",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Canceling recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setShowWaveform(false);
      audioChunksRef.current = [];
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const processRecording = async () => {
    try {
      if (audioChunksRef.current.length === 0) {
        throw new Error('No audio data recorded');
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      console.log('Audio blob size:', audioBlob.size);

      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          console.log('Sending audio to voice-to-text function...');

          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });

          if (error) {
            console.error('Supabase function error:', error);
            throw error;
          }

          console.log('Transcription received:', data);
          
          if (data.text && data.text.trim()) {
            onTranscriptionComplete(data.text.trim());
            toast({
              title: "语音识别成功",
              description: `识别文本: ${data.text.trim()}`,
            });
          } else {
            toast({
              title: "未识别到语音",
              description: "请重新录音或检查麦克风",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error processing transcription:', error);
          toast({
            title: "语音转换失败",
            description: "请重试或手动输入文字",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error in processRecording:', error);
      setIsProcessing(false);
      toast({
        title: "处理录音失败",
        description: "请重试录音",
        variant: "destructive",
      });
    }
  };

  const handleClick = () => {
    if (!isRecording && !isProcessing) {
      startRecording();
    }
  };

  // ChatGPT-style waveform animation
  const WaveformAnimation = () => (
    <div className="flex items-center justify-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-gray-400 rounded-full"
          style={{
            height: `${20 + Math.sin(Date.now() / 200 + i) * 15}px`,
            animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite alternate`
          }}
        />
      ))}
    </div>
  );

  if (showWaveform && isRecording) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl">
          {/* Waveform visualization */}
          <div className="mb-8 h-16 flex items-center justify-center">
            <WaveformAnimation />
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-center space-x-8">
            {/* Cancel button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelRecording}
              className="h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <X className="w-6 h-6" />
            </Button>
            
            {/* Stop/Send button */}
            <Button
              onClick={stopRecording}
              className="h-14 w-14 bg-black hover:bg-gray-800 text-white rounded-full p-0 shadow-lg"
            >
              <div className="w-4 h-4 bg-white rounded-sm" />
            </Button>
          </div>
          
          {/* Recording indicator */}
          <div className="mt-4 text-sm text-gray-500 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Recording...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      variant="outline"
      size="icon"
      className={`h-10 w-10 rounded-full border-gray-300 hover:bg-gray-50 ${
        isProcessing ? 'opacity-50' : ''
      }`}
    >
      {isProcessing ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Mic className="w-4 h-4 text-gray-600" />
      )}
    </Button>
  );
};

export default VoiceRecorder;
