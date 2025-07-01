
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
import { useAudioProcessor } from '@/hooks/useAudioProcessor';
import { useTavusVideo } from '@/hooks/useTavusVideo';
import WebRTCVideo from './WebRTCVideo';

const VideoChat = () => {
  const navigate = useNavigate();
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist } = useTherapist(selectedTherapistId);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const streamRef = useRef<MediaStream | null>(null);

  // Get selected persona from localStorage for fallback display
  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  
  const personas = {
    nuva: { name: 'Nuva', icon: Heart, color: 'violet' },
    nova: { name: 'Nova', icon: Zap, color: 'blue' },
    sage: { name: 'Sage', icon: Star, color: 'indigo' }
  };

  const currentPersona = personas[selectedPersona as keyof typeof personas] || personas.nuva;
  const IconComponent = currentPersona.icon;

  // Tavus video hook
  const { 
    isConnecting: isTavusConnecting, 
    isConnected: isTavusConnected, 
    conversation: tavusConversation,
    createConversation: createTavusConversation,
    endConversation: endTavusConversation
  } = useTavusVideo();

  // 音频处理钩子 - 集成Tavus
  const { isProcessing, isConnected, startAudioProcessing } = useAudioProcessor({
    onTranscription: (text) => {
      setCurrentTranscription(text);
      console.log('User said:', text);
      // 如果连接了Tavus，直接发送音频到Tavus而不是通用AI
      if (isTavusConnected && tavusConversation) {
        console.log('Sending audio to Tavus conversation:', tavusConversation.conversation_id);
        // 这里可以通过Tavus API发送音频
      }
    },
    onAIResponse: (response) => {
      setAiResponse(response);
      console.log('AI responded:', response);
    }
  });

  const handleStartCall = async () => {
    if (!therapist) {
      console.error('No therapist selected');
      return;
    }

    try {
      console.log('Starting WebRTC call with Tavus integration for:', therapist.name);
      
      // 1. 先建立Tavus连接
      const tavusConv = await createTavusConversation(therapist.name);
      console.log('Tavus conversation created:', tavusConv);
      
      // 2. 获取本地媒体流
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      setIsCallActive(true);
      
      // 3. 开始音频处理（发送到Tavus）
      if (isMicOn) {
        startAudioProcessing(stream);
      }
      
      console.log('WebRTC + Tavus call started successfully');
      
    } catch (error) {
      console.error('Error starting WebRTC + Tavus call:', error);
      setIsCallActive(false);
    }
  };

  const handleEndCall = async () => {
    console.log('User requested to end call');
    
    // 停止所有媒体轨道
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // 结束Tavus对话
    if (isTavusConnected) {
      await endTavusConversation();
    }
    
    setIsCallActive(false);
    navigate('/user-center');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    console.log('Video toggle:', !isVideoOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    console.log('Mic toggle:', !isMicOn);
  };

  const handleAudioData = (audioData: Float32Array) => {
    // 如果连接了Tavus，可以将实时音频数据发送给Tavus
    if (isTavusConnected && tavusConversation) {
      // 实时音频处理逻辑
    }
  };

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
          {isCallActive ? (
            // 自建WebRTC视频组件
            <WebRTCVideo
              isVideoOn={isVideoOn}
              isMicOn={isMicOn}
              onVideoToggle={toggleVideo}
              onMicToggle={toggleMic}
              onAudioData={handleAudioData}
            />
          ) : (
            // Placeholder when not connected
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
              <div className="text-center">
                <Avatar className="w-24 h-24 mb-6 shadow-md mx-auto">
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
                <p className="text-slate-500 mb-8">准备开始与Tavus AI对话</p>
                <Button
                  onClick={handleStartCall}
                  disabled={!therapist || isTavusConnecting}
                  className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {isTavusConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      连接Tavus中...
                    </>
                  ) : (
                    '开始Tavus对话'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls - Only show when call is active */}
        {isCallActive && (
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

      {/* Tavus Connection Status */}
      {isTavusConnected && (
        <div className="absolute top-6 right-6 bg-green-100 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700">Tavus已连接</span>
          </div>
        </div>
      )}

      {/* AI Processing Indicator */}
      {isProcessing && (
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/60">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
            <span className="text-sm text-slate-600">AI处理中...</span>
          </div>
        </div>
      )}

      {/* Transcription Display */}
      {currentTranscription && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 max-w-md">
          <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/60">
            <p className="text-sm text-slate-600">你说: {currentTranscription}</p>
          </div>
        </div>
      )}

      {/* AI Response Display */}
      {aiResponse && (
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 max-w-md">
          <div className="bg-violet-50 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-violet-200">
            <p className="text-sm text-violet-700">Tavus回应: {aiResponse}</p>
          </div>
        </div>
      )}

      {/* Mindful Prompt */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-slate-600/80 text-sm font-medium tracking-wide">
          WebRTC + Tavus AI 视频对话
        </p>
      </div>

      {/* Back Button - Only visible when not in call */}
      {!isCallActive && (
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
