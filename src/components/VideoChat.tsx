
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
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
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleStartCall = async () => {
    if (!therapist) {
      console.error('No therapist selected');
      return;
    }

    try {
      console.log('Starting call with therapist:', therapist.name);
      await createConversation(therapist.name);
    } catch (error) {
      console.error('Error starting video call:', error);
    }
  };

  const handleEndCall = async () => {
    console.log('User requested to end call');
    await endConversation();
    navigate('/user-center');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    console.log('Video toggle:', !isVideoOn);
    // Note: Actual video toggle would need to be implemented with Tavus API
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    console.log('Mic toggle:', !isMicOn);
    // Note: Actual mic toggle would need to be implemented with Tavus API
  };

  // Log conversation status changes
  useEffect(() => {
    console.log('Conversation status:', {
      isConnecting,
      isConnected,
      conversationId: conversation?.conversation_id,
      error
    });
  }, [isConnecting, isConnected, conversation, error]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Main Video Container */}
      <div 
        className="relative group transition-all duration-300 ease-out"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Window */}
        <div className="w-[80vw] max-w-4xl h-[60vh] min-h-[400px] rounded-2xl shadow-lg overflow-hidden bg-white/95 backdrop-blur-sm border border-white/60">
          {isConnected && conversation?.conversation_url ? (
            // Tavus video iframe - with auto-join parameters
            <iframe
              src={`${conversation.conversation_url}?autoJoin=true&skipIntro=true&hideControls=false`}
              className="w-full h-full border-0 rounded-2xl"
              allow="camera; microphone; fullscreen"
              title="视频通话"
            />
          ) : (
            // Placeholder when not connected
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
              <div className="text-center">
                {isConnecting ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mb-6">
                      <Loader2 className="w-full h-full animate-spin text-violet-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">正在连接...</h3>
                    <p className="text-slate-500">即将开始对话</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                      <PhoneOff className="w-10 h-10 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">连接遇到问题</h3>
                    <p className="text-slate-500 mb-6">请重新尝试连接</p>
                    <Button
                      onClick={handleStartCall}
                      disabled={!therapist}
                      className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                    >
                      重新连接
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-6 shadow-md">
                      <AvatarImage 
                        src={therapist?.image_url || ''} 
                        alt={`${therapist?.name || currentPersona.name} avatar`}
                      />
                      <AvatarFallback className={`bg-gradient-to-br text-white text-2xl ${
                        currentPersona.color === 'blue' 
                          ? 'from-blue-400 to-blue-500' 
                          : currentPersona.color === 'violet' 
                            ? 'from-violet-400 to-violet-500'
                            : 'from-indigo-400 to-indigo-500'
                      }`}>
                        {therapist?.name?.charAt(0) || <IconComponent className="w-12 h-12" />}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">
                      {therapist?.name || `Dr. ${currentPersona.name}`}
                    </h3>
                    <p className="text-slate-500 mb-8">准备开始对话</p>
                    <Button
                      onClick={handleStartCall}
                      disabled={!therapist}
                      className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      开始对话
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls - Only show when connected */}
        {isConnected && (
          <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
            <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-white/60">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMic}
                className={`w-12 h-12 rounded-full transition-all duration-300 ${
                  isMicOn 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full transition-all duration-300 ${
                  isVideoOn 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              <Button
                onClick={handleEndCall}
                className="bg-rose-500 hover:bg-rose-600 text-white w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 shadow-md"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mindful Prompt */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-slate-600/80 text-sm font-medium tracking-wide">
          你可以随时离开或说出你的感觉
        </p>
      </div>

      {/* Back Button - Only visible when not in call */}
      {!isConnected && (
        <button
          onClick={() => navigate('/user-center')}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 flex items-center justify-center shadow-md border border-white/60"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default VideoChat;
