
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
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Unable to access microphone, please check permissions",
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
          } else {
            toast({
              title: "No Speech Detected",
              description: "Please record again or check microphone",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error processing transcription:', error);
          toast({
            title: "Speech Conversion Failed",
            description: "Please try again or type manually",
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
        title: "Recording Processing Failed",
        description: "Please try recording again",
        variant: "destructive",
      });
    }
  };

  const handleClick = () => {
    if (!isRecording && !isProcessing) {
      startRecording();
    }
  };

  // Simple waveform animation
  const WaveformAnimation = () => (
    <div className="flex items-center justify-center space-x-1 h-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-gray-500 rounded-full animate-pulse"
          style={{
            height: `${16 + Math.sin(Date.now() / 300 + i * 0.5) * 8}px`,
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  if (showWaveform && isRecording) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
          {/* Header */}
          <h2 className="text-xl font-medium text-gray-800 mb-8">Listening...</h2>
          
          {/* Waveform */}
          <div className="mb-8">
            <WaveformAnimation />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            {/* Cancel */}
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelRecording}
              className="h-12 w-12 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Stop Recording */}
            <Button
              onClick={stopRecording}
              className="h-14 w-14 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg"
            >
              <div className="w-4 h-4 bg-white rounded-sm" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full hover:bg-gray-100 text-gray-600"
    >
      {isProcessing ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
};

export default VoiceRecorder;
