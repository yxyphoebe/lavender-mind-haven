
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
  const [showLocalVideo, setShowLocalVideo] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [localVideoPosition, setLocalVideoPosition] = useState({ x: 20, y: 20 });

  useEffect(() => {
    if (!daily) return;

    const updateParticipants = () => {
      const participants = daily.participants();
      const remote = Object.values(participants).find((p: any) => !p.local);
      setRemoteParticipant(remote);
    };

    daily.on('participant-joined', updateParticipants);
    daily.on('participant-left', updateParticipants);
    daily.on('participant-updated', updateParticipants);

    updateParticipants();

    return () => {
      daily.off('participant-joined', updateParticipants);
      daily.off('participant-left', updateParticipants);
      daily.off('participant-updated', updateParticipants);
    };
  }, [daily]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  // Initialize audio/video after joining
  useEffect(() => {
    if (daily) {
      setTimeout(() => {
        daily.setLocalAudio(true);
        daily.setLocalVideo(true);
      }, 200);
      
      daily.updateInputSettings({
        audio: {
          processor: {
            type: 'none'
          }
        }
      }).catch(err => console.log('Audio settings update failed:', err));
    }
  }, [daily]);

  const handleScreenTap = () => {
    setShowControls(!showControls);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentClientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentClientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const newX = Math.max(10, Math.min(currentClientX - offsetX, window.innerWidth - 130));
      const newY = Math.max(10, Math.min(currentClientY - offsetY, window.innerHeight - 100));
      setLocalVideoPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };

  const toggleLocalVideo = () => {
    setShowLocalVideo(!showLocalVideo);
    setShowControls(true);
  };

  const handleLeave = useCallback(() => {
    if (daily) {
      daily.leave();
    }
    onLeave();
  }, [daily, onLeave]);

  const localVideo = localParticipant?.videoTrack;
  const remoteVideo = remoteParticipant?.videoTrack;
  const remoteAudio = remoteParticipant?.audioTrack;

  const localVideoElement = useMemo(() => {
    if (!localVideo || !showLocalVideo) return null;
    
    return (
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
        ref={(video) => {
          if (video && localVideo) {
            video.srcObject = new MediaStream([localVideo]);
          }
        }}
      />
    );
  }, [localVideo, showLocalVideo]);

  const remoteVideoElement = useMemo(() => {
    if (!remoteVideo) return null;
    
    return (
      <video
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        ref={(video) => {
          if (video && remoteVideo) {
            video.srcObject = new MediaStream([remoteVideo]);
          }
        }}
      />
    );
  }, [remoteVideo]);

  const remoteAudioElement = useMemo(() => {
    if (!remoteAudio) return null;
    
    return (
      <audio
        autoPlay
        ref={(audio) => {
          if (audio && remoteAudio) {
            audio.srcObject = new MediaStream([remoteAudio]);
          }
        }}
      />
    );
  }, [remoteAudio]);

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden"
      onClick={handleScreenTap}
      style={{ 
        height: '100vh', 
        width: '100vw',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {/* Full-screen Remote Video */}
      <div className="absolute inset-0">
        {remoteVideo ? (
          remoteVideoElement
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center mb-4 mx-auto overflow-hidden">
                {therapist?.image_url ? (
                  <img 
                    src={therapist.image_url} 
                    alt={therapist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {therapist?.name?.[0] || 'N'}
                  </span>
                )}
              </div>
              <p className="text-white/80 font-medium">Connecting to {therapist?.name || 'Nuva'}...</p>
            </div>
          </div>
        )}
        
        {/* Audio Element */}
        {remoteAudioElement}
      </div>

      {/* Local Video Window (FaceTime style) */}
      {showLocalVideo && localVideoElement && (
        <div
          className={`absolute w-32 h-24 bg-black rounded-xl overflow-hidden shadow-2xl border border-white/20 cursor-move ${
            isDragging ? 'z-50' : 'z-10'
          }`}
          style={{
            left: `${localVideoPosition.x}px`,
            top: `${localVideoPosition.y}px`,
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={(e) => e.stopPropagation()}
        >
          {localVideoElement}
        </div>
      )}

      {/* FaceTime-style Controls */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center space-x-6 bg-black/40 backdrop-blur-md rounded-full px-6 py-4">
          <button
            onClick={toggleLocalVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              showLocalVideo 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-white/80 text-black hover:bg-white'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {showLocalVideo ? (
                <path d="M1 4.27L2.28 3L21 21.72L19.73 23L15.54 18.81C14.77 18.93 13.91 19 13 19C8.03 19 4 15.21 4 10.5C4 9.59 4.07 8.73 4.19 7.96L1 4.73L1 4.27M13 3C18.5 3 23 7.03 23 12S18.5 21 13 21C7.5 21 3 16.97 3 12C3 6.03 7.5 2 13 2C18.5 2 23 6.03 23 12Z"/>
              ) : (
                <path d="M15.5 12C15.5 13.07 14.57 14 13.5 14C12.43 14 11.5 13.07 11.5 12C11.5 10.93 12.43 10 13.5 10C14.57 10 15.5 10.93 15.5 12M19.5 12C19.5 15.59 16.59 18.5 13 18.5C9.41 18.5 6.5 15.59 6.5 12C6.5 8.41 9.41 5.5 13 5.5C16.59 5.5 19.5 8.41 19.5 12Z"/>
              )}
            </svg>
          </button>
          
          <button
            onClick={handleLeave}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </button>
        </div>
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
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse overflow-hidden">
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
          <p className="text-white/80 font-medium">Initializing video call...</p>
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
