import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Star,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { useTavusVideo } from '@/hooks/useTavusVideo';

const VideoChat = () => {
  const navigate = useNavigate();
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist } = useTherapist(selectedTherapistId);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use the Tavus hook for video functionality
  const {
    isConnecting,
    isConnected,
    conversation,
    error,
    createConversation,
    endConversation
  } = useTavusVideo();

  // Get selected persona from localStorage for fallback display
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
    if (!therapist) {
      return;
    }

    try {
      await createConversation(therapist.name);
    } catch (error) {
      console.error('Error starting video call:', error);
    }
  };

  const handleEndCall = async () => {
    await endConversation();
    navigate('/user-center');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // Note: Actual video toggle would need to be implemented with Tavus API
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Note: Actual mic toggle would need to be implemented with Tavus API
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
              onClick={() => navigate('/user-center')}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={therapist?.image_url || ''} 
                alt={`${therapist?.name || currentPersona.name} avatar`}
              />
              <AvatarFallback className={`bg-gradient-to-br ${
                currentPersona.color === 'blue' 
                  ? 'from-blue-400 to-blue-500' 
                  : currentPersona.color === 'violet' 
                    ? 'from-violet-400 to-violet-500'
                    : 'from-indigo-400 to-indigo-500'
              }`}>
                {therapist?.name?.charAt(0) || <IconComponent className="w-6 h-6 text-white" />}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="font-display text-lg font-semibold">
                {therapist?.name || `Dr. ${currentPersona.name}`}
              </h2>
              <p className="text-sm text-white/80">
                {isConnecting 
                  ? 'Connecting...' 
                  : isConnected 
                    ? `Connected • ${formatTime(connectionTime)}` 
                    : 'Ready to connect'
                }
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
        {isConnected && conversation?.conversation_url ? (
          // Tavus video iframe
          <iframe
            ref={iframeRef}
            src={conversation.conversation_url}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen"
            title="Tavus Video Call"
          />
        ) : (
          // Placeholder when not connected
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-center text-white">
              {isConnecting ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 animate-spin mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Connecting...</h3>
                  <p className="text-white/80">Setting up your video session</p>
                </div>
              ) : (
                <>
                  <Avatar className={`w-32 h-32 mx-auto mb-4`}>
                    <AvatarImage 
                      src={therapist?.image_url || ''} 
                      alt={`${therapist?.name || currentPersona.name} avatar`}
                    />
                    <AvatarFallback className={`bg-gradient-to-br ${
                      currentPersona.color === 'blue' 
                        ? 'from-blue-400 to-blue-500' 
                        : currentPersona.color === 'violet' 
                          ? 'from-violet-400 to-violet-500'
                          : 'from-indigo-400 to-indigo-500'
                    }`}>
                      {therapist?.name?.charAt(0) || <IconComponent className="w-16 h-16 text-white" />}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-bold mb-2">
                    {therapist?.name || `Dr. ${currentPersona.name}`}
                  </h3>
                  <p className="text-white/80">Ready for video session</p>
                </>
              )}
            </div>
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
          {!isConnected && !isConnecting ? (
            <Button
              onClick={handleStartCall}
              disabled={!therapist}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Video className="w-6 h-6 mr-2" />
              Start Video Call
            </Button>
          ) : isConnecting ? (
            <Button
              disabled
              className="bg-gray-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Connecting...
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
