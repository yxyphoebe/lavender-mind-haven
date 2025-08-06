
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { DailyProvider, useDaily, useLocalParticipant } from '@daily-co/daily-react';
import Daily from '@daily-co/daily-js';
import { Button } from '@/components/ui/button';
import { PhoneOff, Eye, EyeOff, Move } from 'lucide-react';

interface DailyVideoCallProps {
  roomUrl: string;
  onLeave: () => void;
  therapist?: {
    id: string;
    name: string;
    image_url?: string;
  };
}

const VideoCallContent: React.FC<{ onLeave: () => void; therapist?: { id: string; name: string; image_url?: string } }> = ({ onLeave, therapist }) => {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const [remoteParticipant, setRemoteParticipant] = useState<any>(null);
  
  // Local video controls
  const [showLocalVideo, setShowLocalVideo] = useState(true);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Get remote participant manually since useParticipants doesn't exist
  useEffect(() => {
    if (!daily) return;

    const updateParticipants = () => {
      const participants = daily.participants();
      const remote = Object.values(participants).find((p: any) => !p.local);
      setRemoteParticipant(remote);
    };

    // Listen for participant events
    daily.on('participant-joined', updateParticipants);
    daily.on('participant-left', updateParticipants);
    daily.on('participant-updated', updateParticipants);

    // Initial update
    updateParticipants();

    return () => {
      daily.off('participant-joined', updateParticipants);
      daily.off('participant-left', updateParticipants);
      daily.off('participant-updated', updateParticipants);
    };
  }, [daily]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    const container = dragRef.current.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const videoRect = dragRef.current.getBoundingClientRect();
    
    const newX = Math.max(0, Math.min(
      containerRect.width - videoRect.width,
      e.clientX - containerRect.left - dragOffset.current.x
    ));
    const newY = Math.max(0, Math.min(
      containerRect.height - videoRect.height,
      e.clientY - containerRect.top - dragOffset.current.y
    ));
    
    setDragPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleLeave = useCallback(() => {
    if (daily) {
      daily.leave();
    }
    onLeave();
  }, [daily, onLeave]);

  // Initialize audio/video after joining with optimized settings
  useEffect(() => {
    if (daily) {
      // Defer A/V enable by 200ms to allow connection to stabilize
      setTimeout(() => {
        daily.setLocalAudio(true);
        daily.setLocalVideo(true);
      }, 200);
      
      // Configure for low latency
      daily.updateInputSettings({
        audio: {
          processor: {
            type: 'none' // Disable audio processing for lower latency
          }
        }
      }).catch(err => console.log('Audio settings update failed:', err));
    }
  }, [daily]);

  // Memoize video elements to prevent unnecessary re-renders
  const localVideo = localParticipant?.videoTrack;
  const remoteVideo = remoteParticipant?.videoTrack;
  const remoteAudio = remoteParticipant?.audioTrack;

  const localVideoElement = useMemo(() => {
    if (!localVideo || !showLocalVideo) return null;
    return (
      <div 
        ref={dragRef}
        className={`absolute w-48 h-36 bg-slate-900/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-blue-300/30 cursor-move select-none transition-all duration-200 glass-effect ${
          isDragging ? 'scale-105 shadow-2xl' : ''
        }`}
        style={{
          left: `${dragPosition.x}px`,
          top: `${dragPosition.y}px`,
          right: dragPosition.x === 0 ? '24px' : 'auto',
          bottom: dragPosition.x === 0 && dragPosition.y === 0 ? '24px' : 'auto'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-2 left-2 z-10 opacity-60 hover:opacity-100 transition-opacity">
          <div className="bg-black/50 rounded-full p-1">
            <Move className="w-4 h-4 text-white" />
          </div>
        </div>
        <video
          ref={(ref) => {
            if (ref && localVideo) {
              ref.srcObject = new MediaStream([localVideo]);
            }
          }}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
      </div>
    );
  }, [localVideo, showLocalVideo, dragPosition, isDragging, handleMouseDown]);

  const remoteVideoElement = useMemo(() => {
    if (!remoteVideo) return null;
    return (
      <video
        ref={(ref) => {
          if (ref && remoteVideo) {
            ref.srcObject = new MediaStream([remoteVideo]);
          }
        }}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }, [remoteVideo]);

  const remoteAudioElement = useMemo(() => {
    if (!remoteAudio) return null;
    return (
      <audio
        ref={(ref) => {
          if (ref && remoteAudio) {
            ref.srcObject = new MediaStream([remoteAudio]);
          }
        }}
        autoPlay
        playsInline
      />
    );
  }, [remoteAudio]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center p-6">
      {/* Header Message */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-display font-semibold text-slate-700 mb-2">
          {therapist?.name || 'Nuva'} is here with you
        </h2>
        <p className="text-slate-600 font-medium">
          Take a deep breath and let's begin this mindful conversation
        </p>
      </div>

      {/* Video Container */}
      <div className="relative w-full max-w-4xl h-[60vh] bg-blue-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-200/30 overflow-hidden glass-effect">
        {/* Remote Video (Tavus AI) */}
        {remoteVideo && (
          <div className="absolute inset-0">
            {remoteVideoElement}
          </div>
        )}

        {/* Remote Audio (Hidden audio element for AI voice) */}
        {remoteAudioElement}

        {/* Local Video (User) */}
        {localVideoElement}

        {/* Placeholder when no video */}
        {!remoteVideo && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg overflow-hidden">
                {therapist?.image_url ? (
                  <img 
                    src={therapist.image_url} 
                    alt={therapist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {therapist?.name?.[0] || 'N'}
                  </span>
                )}
              </div>
              <p className="text-slate-600 font-medium">Connecting to {therapist?.name || 'Nuva'}...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <Button
          onClick={() => setShowLocalVideo(!showLocalVideo)}
          variant="outline"
          className="bg-blue-50/80 hover:bg-blue-100/80 text-slate-700 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg border border-blue-300/50 backdrop-blur-sm"
        >
          {showLocalVideo ? (
            <>
              <EyeOff className="w-5 h-5 mr-2" />
              Hide Self
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 mr-2" />
              Show Self
            </>
          )}
        </Button>
        
        <Button
          onClick={handleLeave}
          className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl border border-red-300/30"
        >
          <PhoneOff className="w-6 h-6 mr-3" />
          End Call
        </Button>
      </div>

      {/* Connection Status */}
      <div className="mt-6 text-center">
        <p className="text-slate-500 text-sm">
          {remoteParticipant ? 'Connected' : 'Waiting for connection...'}
        </p>
      </div>
    </div>
  );
};

const DailyVideoCall: React.FC<DailyVideoCallProps> = ({ roomUrl, onLeave, therapist }) => {
  const [callObject, setCallObject] = useState<any>(null);

  useEffect(() => {
    // Create Daily call object with optimized settings for low latency
    const daily = Daily.createCallObject({
      // Start without audio/video to enable them after join for better connection
      audioSource: false,
      videoSource: false,
      
      // Network and connection optimization
      subscribeToTracksAutomatically: true,
      
      // Additional configuration for performance
      dailyConfig: {
        // Remove the unsupported property - only use valid Daily.co config
        userMediaAudioConstraints: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        userMediaVideoConstraints: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      }
    });
    
    setCallObject(daily);

    // Join with optimized parameters
    daily.join({ 
      url: roomUrl,
      userName: 'User',
      userData: { isOptimizedForLatency: true }
    }).then(() => {
      console.log('Successfully joined Daily room');
    }).catch((error) => {
      console.error('Failed to join Daily room:', error);
    });

    return () => {
      daily.destroy();
    };
  }, [roomUrl]);

  if (!callObject) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse overflow-hidden">
            {therapist?.image_url ? (
              <img 
                src={therapist.image_url} 
                alt={therapist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xl font-bold">
                {therapist?.name?.[0] || 'N'}
              </span>
            )}
          </div>
          <p className="text-slate-600 font-medium">Initializing video call...</p>
        </div>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <VideoCallContent onLeave={onLeave} therapist={therapist} />
    </DailyProvider>
  );
};

export default DailyVideoCall;
