
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface WebRTCVideoProps {
  isVideoOn: boolean;
  isMicOn: boolean;
  onVideoToggle: () => void;
  onMicToggle: () => void;
  onAudioData?: (audioData: Float32Array) => void;
}

const WebRTCVideo: React.FC<WebRTCVideoProps> = ({
  isVideoOn,
  isMicOn,
  onVideoToggle,
  onMicToggle,
  onAudioData
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize media stream
  const initializeMedia = async () => {
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

      // Setup audio analysis
      if (onAudioData) {
        setupAudioAnalysis(stream);
      }

      setIsInitialized(true);
      console.log('Media stream initialized successfully');
    } catch (error) {
      console.error('Error initializing media:', error);
    }
  };

  // Setup audio analysis
  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 2048;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start audio data processing
      const processAudio = () => {
        if (analyserRef.current && onAudioData) {
          const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getFloatFrequencyData(dataArray);
          onAudioData(dataArray);
        }
        requestAnimationFrame(processAudio);
      };
      
      processAudio();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  };

  // Toggle video state
  useEffect(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOn;
      }
    }
  }, [isVideoOn]);

  // Toggle audio state
  useEffect(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMicOn;
      }
    }
  }, [isMicOn]);

  // Initialize on component mount
  useEffect(() => {
    initializeMedia();

    return () => {
      // Clean up resources
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-white rounded-2xl overflow-hidden">
      {/* Video display area */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isVideoOn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'scaleX(-1)' }} // Mirror effect
      />

      {/* Placeholder when video is off */}
      {!isVideoOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center mb-4 mx-auto">
              <VideoOff className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-600 font-medium">Camera is off</p>
          </div>
        </div>
      )}

      {/* Audio status indicator */}
      {!isMicOn && (
        <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <MicOff className="w-3 h-3" />
          <span>Muted</span>
        </div>
      )}

      {/* Initialization status */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-slate-600">Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebRTCVideo;
