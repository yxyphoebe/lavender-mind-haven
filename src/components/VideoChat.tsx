
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageCircle,
  Settings,
  ArrowLeft,
  Heart,
  Zap,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoChat = () => {
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get selected persona from localStorage
  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  
  const personas = {
    nuva: { name: 'Nuva', icon: Heart, color: 'violet' },
    nova: { name: 'Nova', icon: Zap, color: 'blue' },
    sage: { name: 'Sage', icon: Star, color: 'indigo' }
  };

  const currentPersona = personas[selectedPersona as keyof typeof personas] || personas.nuva;
  const IconComponent = currentPersona.icon;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera or microphone. Please check your permissions.');
    }
  };

  const handleEndCall = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsConnected(false);
    setConnectionTime(0);
    navigate('/chat');
  };

  const toggleVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleMic = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/chat')}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Avatar className={`w-10 h-10 bg-gradient-to-br ${
              currentPersona.color === 'blue' 
                ? 'from-blue-400 to-blue-500' 
                : currentPersona.color === 'violet' 
                  ? 'from-violet-400 to-violet-500'
                  : 'from-indigo-400 to-indigo-500'
            }`}>
              <AvatarFallback className="bg-transparent">
                <IconComponent className="w-6 h-6 text-white" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="font-display text-lg font-semibold">
                Dr. {currentPersona.name}
              </h2>
              <p className="text-sm text-white/80">
                {isConnected ? `Connected • ${formatTime(connectionTime)}` : 'Ready to connect'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* AI Therapist Video (Placeholder) */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-center text-white">
              <Avatar className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-br ${
                currentPersona.color === 'blue' 
                  ? 'from-blue-400 to-blue-500' 
                  : currentPersona.color === 'violet' 
                    ? 'from-violet-400 to-violet-500'
                    : 'from-indigo-400 to-indigo-500'
              }`}>
                <AvatarFallback className="bg-transparent">
                  <IconComponent className="w-16 h-16 text-white" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold mb-2">Dr. {currentPersona.name}</h3>
              <p className="text-white/80">
                {isConnected ? "I'm here to support you" : "Waiting to connect..."}
              </p>
            </div>
          </div>
        </div>

        {/* User Video (Small overlay) */}
        {isConnected && (
          <div className="absolute top-20 right-4 w-32 h-24 bg-slate-900 rounded-xl overflow-hidden border-2 border-white/20">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
            />
            {!isVideoOn && (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-white/60" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Overlay */}
      {showChat && isConnected && (
        <div className="absolute right-4 top-20 bottom-24 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Session Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(false)}
              className="w-6 h-6"
            >
              ×
            </Button>
          </div>
          <div className="flex-1 bg-slate-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-slate-600 text-center">
              Chat messages will appear here during your video session
            </p>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
            />
            <Button size="sm" className="bg-violet-500 hover:bg-violet-600">
              Send
            </Button>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-center space-x-6">
          {!isConnected ? (
            <Button
              onClick={handleStartCall}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Video className="w-6 h-6 mr-2" />
              Start Video Call
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMic}
                className={`w-14 h-14 rounded-full text-white transition-all duration-300 ${
                  isMicOn 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full text-white transition-all duration-300 ${
                  isVideoOn 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              <Button
                onClick={handleEndCall}
                className="bg-red-500 hover:bg-red-600 text-white w-14 h-14 rounded-full transition-all duration-300 hover:scale-105"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
