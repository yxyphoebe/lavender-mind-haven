
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { useTavusVideo } from '@/hooks/useTavusVideo';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Zap, Star, AlertCircle } from 'lucide-react';
import DailyVideoCall from './DailyVideoCall';

const VideoChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist } = useTherapist(selectedTherapistId);
  
  const [isInCall, setIsInCall] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  // Tavus integration
  const { 
    isConnecting, 
    isConnected, 
    session,
    error,
    startAudioSession, 
    endAudioSession 
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
      toast({
        title: "未选择治疗师",
        description: "请先选择一位治疗师",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Starting Tavus session for:', therapist.name);
      
      // Start Tavus session
      const tavusSession = await startAudioSession(therapist.name);
      
      if (tavusSession && tavusSession.conversation_url) {
        setRoomUrl(tavusSession.conversation_url);
        setIsInCall(true);
        
        toast({
          title: "会话已开始",
          description: `与 ${therapist.name} 的智能对话已建立`
        });
      } else {
        throw new Error('No conversation URL received from Tavus');
      }
      
    } catch (error) {
      console.error('Error starting video call:', error);
      toast({
        title: "连接失败",
        description: "无法建立视频会话，请重试",
        variant: "destructive"
      });
    }
  };

  const handleLeaveCall = async () => {
    console.log('Leaving video call');
    
    // End Tavus session
    if (isConnected) {
      await endAudioSession();
    }
    
    setIsInCall(false);
    setRoomUrl(null);
    
    toast({
      title: "会话已结束",
      description: "智能对话已成功结束"
    });
    
    navigate('/user-center');
  };

  // If in call, show the Daily video interface
  if (isInCall && roomUrl) {
    return <DailyVideoCall roomUrl={roomUrl} onLeave={handleLeaveCall} />;
  }

  // Pre-call interface
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-indigo-900/20" />
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        {/* Avatar */}
        <div className={`w-40 h-40 mb-8 mx-auto rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center ${
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
            <IconComponent className="w-20 h-20 text-white" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          {therapist?.name || `Dr. ${currentPersona.name}`}
        </h1>
        
        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
          准备开始一场宁静的心灵对话
        </p>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-red-300 text-sm font-medium">连接失败</p>
              <p className="text-red-400 text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Start call button */}
        <Button
          onClick={handleStartCall}
          disabled={!therapist || isConnecting}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl border border-violet-500/50 disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              正在连接...
            </>
          ) : (
            '开始视频对话'
          )}
        </Button>

        {/* Tech info */}
        <p className="text-slate-500 text-sm mt-8">
          基于 Daily SDK + Tavus AI 的智能视频对话
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/user-center')}
        className="absolute top-8 left-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center shadow-lg border border-white/10"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
};

export default VideoChat;
