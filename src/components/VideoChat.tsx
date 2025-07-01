
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
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
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    isConnecting,
    isConnected,
    conversation,
    error,
    createConversation,
    endConversation
  } = useTavusVideo();

  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  
  const personas = {
    nuva: { name: 'Nuva', icon: Heart, color: 'rose' },
    nova: { name: 'Nova', icon: Zap, color: 'blue' },
    sage: { name: 'Sage', icon: Star, color: 'purple' }
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

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    console.log('Mic toggle:', !isMicOn);
  };

  useEffect(() => {
    console.log('Conversation status:', {
      isConnecting,
      isConnected,
      conversationId: conversation?.conversation_id,
      error
    });
  }, [isConnecting, isConnected, conversation, error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 relative">
      {/* Gentle Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/user-center')}
        className="absolute top-6 left-6 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-full p-2 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {/* Main Video Container */}
      <div className="flex flex-col items-center space-y-8 max-w-4xl w-full">
        {/* Video Window */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
        >
          <div className="relative w-full max-w-3xl aspect-video bg-white rounded-2xl shadow-lg overflow-hidden">
            {isConnected && conversation?.conversation_url ? (
              <iframe
                ref={iframeRef}
                src={conversation.conversation_url}
                className="w-full h-full border-0"
                allow="camera; microphone; fullscreen"
                title="Video Call"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                  {isConnecting ? (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-rose-400 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                      <h3 className="text-xl font-medium text-slate-700 mb-2">正在连接...</h3>
                      <p className="text-slate-500">为您准备一个安静的空间</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center mb-6">
                        <PhoneOff className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-medium text-slate-700 mb-2">连接遇到问题</h3>
                      <p className="text-slate-500 mb-6">请稍后再试，或许换个时间会更好</p>
                      <Button
                        onClick={handleStartCall}
                        disabled={!therapist}
                        className="bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                      >
                        重新尝试
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Avatar className="w-24 h-24 mb-6 shadow-lg">
                        <AvatarImage 
                          src={therapist?.image_url || ''} 
                          alt={`${therapist?.name || currentPersona.name} avatar`}
                        />
                        <AvatarFallback className={`bg-gradient-to-br ${
                          currentPersona.color === 'blue' 
                            ? 'from-blue-400 to-blue-500' 
                            : currentPersona.color === 'rose' 
                              ? 'from-rose-400 to-rose-500'
                              : 'from-purple-400 to-purple-500'
                        }`}>
                          {therapist?.name?.charAt(0) || <IconComponent className="w-12 h-12 text-white" />}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-2xl font-medium text-slate-700 mb-2">
                        {therapist?.name || `Dr. ${currentPersona.name}`}
                      </h3>
                      <p className="text-slate-500 mb-8">准备好与您对话</p>
                      <Button
                        onClick={handleStartCall}
                        disabled={!therapist}
                        className="bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        开始对话
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Floating Controls - Only show on hover when connected */}
            {isConnected && (
              <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                isVideoHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMic}
                    className={`w-12 h-12 rounded-full transition-all duration-300 ${
                      isMicOn 
                        ? 'text-slate-600 hover:bg-slate-100' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>

                  <Button
                    onClick={handleEndCall}
                    className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gentle Reminder */}
        <div className="text-center">
          <p className="text-slate-500 font-light text-lg">
            你可以随时离开或说出你的感觉
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
