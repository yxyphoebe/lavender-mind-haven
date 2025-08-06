
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { DailyProvider, useDaily, useLocalParticipant } from '@daily-co/daily-react';
import Daily from '@daily-co/daily-js';
import { Button } from '@/components/ui/button';
import { PhoneOff, Mic, MicOff } from 'lucide-react';

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
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

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

  const toggleMute = useCallback(() => {
    if (daily) {
      const newMutedState = !isMuted;
      daily.setLocalAudio(!newMutedState);
      setIsMuted(newMutedState);
      setShowControls(true);
    }
  }, [daily, isMuted]);

  const handleLeave = useCallback(() => {
    if (daily) {
      daily.leave();
    }
    onLeave();
  }, [daily, onLeave]);

  const remoteVideo = remoteParticipant?.videoTrack;
  const remoteAudio = remoteParticipant?.audioTrack;

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
        width: '100vw'
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

      {/* FaceTime-style Controls */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
          paddingTop: '2rem'
        }}
      >
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-6 bg-black/60 backdrop-blur-lg rounded-full px-8 py-4 shadow-2xl border border-white/10">
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                isMuted 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
            
            <button
              onClick={handleLeave}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
          </div>
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
