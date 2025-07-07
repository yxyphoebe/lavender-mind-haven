
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
        title: "No Therapist Selected",
        description: "Please select a therapist first",
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
      } else {
        throw new Error('No conversation URL received from Tavus');
      }
      
    } catch (error) {
      console.error('Error starting video call:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to establish video session, please try again",
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
    
    navigate('/user-center');
  };

  // If in call, show the Daily video interface
  if (isInCall && roomUrl) {
    return <DailyVideoCall roomUrl={roomUrl} onLeave={handleLeaveCall} />;
  }

  // Pre-call interface
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-100/30 to-lavender-100/20" />
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        {/* Avatar */}
        <div className={`w-40 h-40 mb-8 mx-auto rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center ${
          currentPersona.color === 'blue' 
            ? 'from-sage-200 to-sage-300' 
            : currentPersona.color === 'violet' 
              ? 'from-lavender-200 to-lavender-300'
              : 'from-sage-300 to-lavender-200'
        }`}>
          {therapist?.image_url ? (
            <img 
              src={therapist.image_url} 
              alt={therapist.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <IconComponent className="w-20 h-20 text-sage-600" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-sage-800 mb-4">
          {therapist?.name || `Dr. ${currentPersona.name}`}
        </h1>
        
        <p className="text-xl text-sage-600 mb-8 leading-relaxed">
          Ready to begin a peaceful mindful conversation
        </p>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-rose-700 text-sm font-medium">Connection Failed</p>
              <p className="text-rose-600 text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Start call button */}
        <Button
          onClick={handleStartCall}
          disabled={!therapist || isConnecting}
          className="bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-purple-200 disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              Connecting...
            </>
          ) : (
            'Start Video Call'
          )}
        </Button>

      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/user-center')}
        className="absolute top-8 left-8 w-12 h-12 rounded-full bg-sage-200/80 backdrop-blur-sm hover:bg-sage-300/80 transition-all duration-300 flex items-center justify-center shadow-lg border border-sage-300/50"
      >
        <svg className="w-6 h-6 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
};

export default VideoChat;
