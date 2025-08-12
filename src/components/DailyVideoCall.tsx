
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { DailyProvider, useDaily } from '@daily-co/daily-react';
import Daily from '@daily-co/daily-js';
import { PhoneOff, Mic, MicOff } from 'lucide-react';
import FullScreenBackdrop from './FullScreenBackdrop';

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
  
  const [remoteParticipant, setRemoteParticipant] = useState<any>(null);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

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
      className="fixed inset-0 bg-background overflow-hidden"
      onClick={handleScreenTap}
      style={{ 
        height: '100vh', 
        width: '100vw'
      }}
    >
      {/* Full-screen Remote Video */}
      <div className="absolute inset-0">
        {remoteVideo ? (
          <video
            autoPlay
            playsInline
            onLoadedMetadata={() => setVideoReady(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            ref={(video) => {
              if (video && remoteVideo) {
                video.srcObject = new MediaStream([remoteVideo]);
              }
            }}
          />
        ) : (
          <div className="w-full h-full">
            <FullScreenBackdrop imageUrl={therapist?.image_url} name={therapist?.name} showLoading />
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
      // Enable audio/video immediately so Tavus can see and hear the user
      audioSource: true,
      videoSource: true,
      
      // Network and connection optimization
      subscribeToTracksAutomatically: true,
      
      // Additional configuration for performance
      dailyConfig: {
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
      <FullScreenBackdrop imageUrl={therapist?.image_url} name={therapist?.name} showLoading />
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <VideoCallContent onLeave={onLeave} therapist={therapist} />
    </DailyProvider>
  );
};

export default DailyVideoCall;
