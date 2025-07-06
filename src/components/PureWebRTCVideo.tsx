
import React, { useRef, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VideoOff, MicOff, Heart, Zap, Star } from 'lucide-react';

interface PureWebRTCVideoProps {
  isVideoOn: boolean;
  isMicOn: boolean;
  therapist?: {
    name: string;
    image_url?: string;
  };
  isAISpeaking: boolean;
  audioLevel?: number;
}

const PureWebRTCVideo: React.FC<PureWebRTCVideoProps> = ({
  isVideoOn,
  isMicOn,
  therapist,
  isAISpeaking,
  audioLevel = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get persona info from localStorage as fallback
  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  const personas = {
    nuva: { name: 'Nuva', icon: Heart, color: 'violet' },
    nova: { name: 'Nova', icon: Zap, color: 'blue' },
    sage: { name: 'Sage', icon: Star, color: 'indigo' }
  };
  const currentPersona = personas[selectedPersona as keyof typeof personas] || personas.nuva;
  const IconComponent = currentPersona.icon;

  // Initialize camera
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: {
            sampleRate: 44100,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize camera:', error);
      }
    };

    initializeCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Control video and audio tracks
  useEffect(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const audioTrack = streamRef.current.getAudioTracks()[0];
      
      if (videoTrack) videoTrack.enabled = isVideoOn;
      if (audioTrack) audioTrack.enabled = isMicOn;
    }
  }, [isVideoOn, isMicOn]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* Main video area */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isVideoOn ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Placeholder when video is off */}
        {!isVideoOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="text-center">
              <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                <VideoOff className="w-16 h-16 text-slate-400" />
              </div>
              <p className="text-slate-300 text-lg font-medium">Camera is off</p>
            </div>
          </div>
        )}

        {/* Initialization loading */}
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-slate-300">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* AI therapist avatar - top right corner */}
      <div className="absolute top-6 right-6 z-10">
        <div className={`relative transition-all duration-300 ${
          isAISpeaking ? 'scale-110' : 'scale-100'
        }`}>
          <Avatar className={`w-20 h-20 shadow-2xl border-4 transition-all duration-300 ${
            isAISpeaking 
              ? 'border-violet-400 shadow-violet-400/50' 
              : 'border-white/20'
          }`}>
            <AvatarImage 
              src={therapist?.image_url || ''} 
              alt={`${therapist?.name || currentPersona.name} avatar`}
            />
            <AvatarFallback className={`text-white text-xl font-medium transition-all duration-300 ${
              currentPersona.color === 'blue' 
                ? 'from-blue-500 to-blue-600' 
                : currentPersona.color === 'violet' 
                  ? 'from-violet-500 to-violet-600'
                  : 'from-indigo-500 to-indigo-600'
            } ${isAISpeaking ? 'bg-gradient-to-br animate-pulse' : 'bg-gradient-to-br'}`}>
              {therapist?.name?.charAt(0) || <IconComponent className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>

          {/* Audio visualization ring when speaking */}
          {isAISpeaking && (
            <div className="absolute inset-0 -z-10">
              <div className="w-full h-full rounded-full border-2 border-violet-400 animate-ping opacity-75"></div>
            </div>
          )}
        </div>

        {/* AI name tag */}
        <div className={`mt-2 text-center transition-all duration-300 ${
          isAISpeaking ? 'opacity-100' : 'opacity-70'
        }`}>
          <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1">
            <p className="text-white text-sm font-medium">
              {therapist?.name || `Dr. ${currentPersona.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* User status indicators - top left corner */}
      <div className="absolute top-6 left-6 z-10 space-y-2">
        {!isMicOn && (
          <div className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg">
            <MicOff className="w-4 h-4" />
            <span>Microphone muted</span>
          </div>
        )}
        
        {!isVideoOn && (
          <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg">
            <VideoOff className="w-4 h-4" />
            <span>Camera is off</span>
          </div>
        )}
      </div>

      {/* Bottom audio visualization bar */}
      {isAISpeaking && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-6 py-3 flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-violet-400 rounded-full transition-all duration-200 ${
                    Math.random() > 0.5 ? 'h-6 animate-pulse' : 'h-3'
                  }`}
                />
              ))}
            </div>
            <span className="text-white text-sm font-medium ml-3">AI is speaking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PureWebRTCVideo;
