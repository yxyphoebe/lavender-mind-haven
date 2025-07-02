
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import PureWebRTCVideo from './PureWebRTCVideo';

const VideoChat = () => {
  const navigate = useNavigate();
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist } = useTherapist(selectedTherapistId);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
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

  // 音频处理钩子 - 纯音频交互
  const { isProcessing, startAudioProcessing } = useAudioProcessor({
    onTranscription: (text) => {
      setCurrentTranscription(text);
      console.log('User said:', text);
      setIsAISpeaking(false);
    },
    onAIResponse: (response) => {
      setAiResponse(response);
      setIsAISpeaking(true);
      console.log('AI responded:', response);
      // 模拟AI说话持续时间
      setTimeout(() => setIsAISpeaking(false), 3000);
    }
  });

  const handleStartCall = async () => {
    if (!therapist) {
      console.error('No therapist selected');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('Starting pure WebRTC video call with:', therapist.name);
      
      // 获取本地媒体流
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      setIsCallActive(true);
      
      // 开始音频处理
      if (isMicOn) {
        startAudioProcessing(stream);
      }
      
      console.log('Pure WebRTC call started successfully');
      
    } catch (error) {
      console.error('Error starting video call:', error);
      setIsCallActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndCall = () => {
    console.log('Ending video call');
    
    // 停止所有媒体轨道
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsCallActive(false);
    setIsAISpeaking(false);
    setCurrentTranscription('');
    setAiResponse('');
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

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 主视频容器 */}
      <div 
        className="relative group transition-all duration-300 ease-out"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* 视频窗口 */}
        <div className="w-[85vw] max-w-6xl h-[70vh] min-h-[500px] rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {isCallActive ? (
            <PureWebRTCVideo
              isVideoOn={isVideoOn}
              isMicOn={isMicOn}
              therapist={therapist}
              isAISpeaking={isAISpeaking}
            />
          ) : (
            // 未连接时的占位符
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className={`w-32 h-32 mb-8 mx-auto rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center ${
                  currentPersona.color === 'blue' 
                    ? 'from-blue-500 to-blue-600' 
                    : currentPersona.color === 'violet' 
                      ? 'from-violet-500 to-violet-600'
                      : 'from-indigo-500 to-indigo-600'
                }`}>
                  {therapist?.image_url ? (
                    <img 
                      src={therapist.image_url} 
                      alt={therapist.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <IconComponent className="w-16 h-16 text-white" />
                  )}
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  {therapist?.name || `Dr. ${currentPersona.name}`}
                </h3>
                <p className="text-slate-300 text-lg mb-12">专业心理健康助手</p>
                <Button
                  onClick={handleStartCall}
                  disabled={!therapist || isConnecting}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl border border-violet-500/50"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      正在连接...
                    </>
                  ) : (
                    '开始视频通话'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 控制面板 - 仅在通话中显示 */}
        {isCallActive && (
          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
            <div className="flex items-center space-x-6 bg-black/40 backdrop-blur-xl rounded-3xl px-8 py-5 shadow-2xl border border-white/10">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMic}
                className={`w-16 h-16 rounded-2xl transition-all duration-300 ${
                  isMicOn 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVideo}
                className={`w-16 h-16 rounded-2xl transition-all duration-300 ${
                  isVideoOn 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-7 h-7" /> : <VideoOff className="w-7 h-7" />}
              </Button>

              <Button
                onClick={handleEndCall}
                className="bg-rose-500 hover:bg-rose-600 text-white w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <PhoneOff className="w-7 h-7" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* AI处理指示器 */}
      {isProcessing && (
        <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-white/10">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
            <span className="text-white font-medium">AI处理中...</span>
          </div>
        </div>
      )}

      {/* 转录显示 */}
      {currentTranscription && (
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 max-w-2xl">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-white/10">
            <p className="text-slate-300 text-sm font-medium mb-1">你说:</p>
            <p className="text-white">{currentTranscription}</p>
          </div>
        </div>
      )}

      {/* AI回应显示 */}
      {aiResponse && (
        <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 max-w-2xl">
          <div className="bg-violet-500/20 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-violet-400/30">
            <p className="text-violet-300 text-sm font-medium mb-1">AI回应:</p>
            <p className="text-white">{aiResponse}</p>
          </div>
        </div>
      )}

      {/* 底部提示 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          纯WebRTC视频通话 + AI语音交互
        </p>
      </div>

      {/* 返回按钮 - 仅在未通话时显示 */}
      {!isCallActive && (
        <button
          onClick={() => navigate('/user-center')}
          className="absolute top-8 left-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center shadow-lg border border-white/10"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default VideoChat;
