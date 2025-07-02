
import React, { useEffect, useCallback, useState } from 'react';
import { DailyProvider, useDaily, useParticipant, useLocalParticipant } from '@daily-co/daily-react';
import Daily from '@daily-co/daily-js';
import { Button } from '@/components/ui/button';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface DailyVideoCallProps {
  roomUrl: string;
  onLeave: () => void;
}

const VideoCallContent: React.FC<{ onLeave: () => void }> = ({ onLeave }) => {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [remoteParticipant, setRemoteParticipant] = useState<any>(null);

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

  const toggleAudio = useCallback(() => {
    if (daily) {
      daily.setLocalAudio(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  }, [daily, isAudioMuted]);

  const toggleVideo = useCallback(() => {
    if (daily) {
      daily.setLocalVideo(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  }, [daily, isVideoMuted]);

  const handleLeave = useCallback(() => {
    if (daily) {
      daily.leave();
    }
    onLeave();
  }, [daily, onLeave]);

  useEffect(() => {
    if (daily) {
      daily.startCamera();
    }
  }, [daily]);

  const localVideo = localParticipant?.videoTrack;
  const remoteVideo = remoteParticipant?.videoTrack;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      {/* Header Message */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-display font-semibold text-slate-700 mb-2">
          Nuva is here with you
        </h2>
        <p className="text-slate-500 font-medium">
          Take a deep breath and let's begin this mindful conversation
        </p>
      </div>

      {/* Video Container */}
      <div className="relative w-full max-w-4xl h-[60vh] bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Remote Video (Tavus AI) */}
        {remoteVideo && (
          <div className="absolute inset-0">
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
          </div>
        )}

        {/* Local Video (User) */}
        {localVideo && (
          <div className="absolute bottom-6 right-6 w-48 h-36 bg-slate-900 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30">
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
        )}

        {/* Placeholder when no video */}
        {!remoteVideo && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white text-4xl font-bold">N</span>
              </div>
              <p className="text-slate-600 font-medium">Connecting to Nuva...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            isAudioMuted 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
              : 'bg-white/80 hover:bg-white text-slate-700 shadow-md'
          }`}
        >
          {isAudioMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            isVideoMuted 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
              : 'bg-white/80 hover:bg-white text-slate-700 shadow-md'
          }`}
        >
          {isVideoMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </Button>

        <Button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <PhoneOff className="w-5 h-5 mr-2" />
          Leave Session
        </Button>
      </div>

      {/* Connection Status */}
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          {remoteParticipant ? 'Connected' : 'Waiting for connection...'}
        </p>
      </div>
    </div>
  );
};

const DailyVideoCall: React.FC<DailyVideoCallProps> = ({ roomUrl, onLeave }) => {
  const [callObject, setCallObject] = useState<any>(null);

  useEffect(() => {
    const daily = Daily.createCallObject();
    setCallObject(daily);

    daily.join({ url: roomUrl });

    return () => {
      daily.destroy();
    };
  }, [roomUrl]);

  if (!callObject) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white text-xl font-bold">N</span>
          </div>
          <p className="text-slate-600 font-medium">Initializing video call...</p>
        </div>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <VideoCallContent onLeave={onLeave} />
    </DailyProvider>
  );
};

export default DailyVideoCall;
