
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { useTavusVideo } from '@/hooks/useTavusVideo';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Zap, Star, AlertCircle } from 'lucide-react';
import DailyVideoCall from './DailyVideoCall';
import RatingDialog from './RatingDialog';

const VideoChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const { data: therapist } = useTherapist(selectedTherapistId);
  
  const [isInCall, setIsInCall] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const startedRef = useRef(false);
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
    
    // Show rating dialog instead of navigating directly
    setShowRating(true);
  };

  const handleRatingClose = () => {
    setShowRating(false);
    navigate('/user-center');
  };

  // Redirect if no therapist is selected
  useEffect(() => {
    if (!selectedTherapistId) {
      navigate('/user-center');
    }
  }, [selectedTherapistId, navigate]);

  // Auto-start the Tavus session once therapist is loaded
  useEffect(() => {
    if (therapist && !startedRef.current && !isConnecting && !isInCall && !roomUrl) {
      startedRef.current = true;
      handleStartCall();
    }
  }, [therapist, isConnecting, isInCall, roomUrl]);

  // If in call, show the Daily video interface
  if (isInCall && roomUrl) {
    return <DailyVideoCall roomUrl={roomUrl} onLeave={handleLeaveCall} therapist={therapist} />;
  }

  // Pre-call interface
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-purple-200/20" />
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        {/* Avatar */}
        <div className={`w-40 h-40 mb-8 mx-auto rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center ${
          currentPersona.color === 'blue' 
            ? 'from-blue-200 to-purple-300' 
            : currentPersona.color === 'violet' 
              ? 'from-blue-200 to-blue-300'
              : 'from-blue-300 to-purple-200'
        }`}>
          {therapist?.image_url ? (
            <img 
              src={therapist.image_url} 
              alt={therapist.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <IconComponent className="w-20 h-20 text-slate-600" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          {therapist?.name || `Dr. ${currentPersona.name}`}
        </h1>
        
        <p className="text-xl text-mindful-600 mb-8 leading-relaxed">
          Ready to begin a peaceful mindful conversation
        </p>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-red-700 text-sm font-medium">Connection Failed</p>
              <p className="text-red-600 text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Connecting state and retry */}
        {!error ? (
          <>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting to video...</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">This may take a few seconds.</p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleStartCall} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                'Retry'
              )}
            </Button>
          </div>
        )}

      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/user-center')}
        className="absolute top-8 left-8 w-12 h-12 rounded-full bg-blue-200/80 backdrop-blur-sm hover:bg-blue-300/80 transition-all duration-300 flex items-center justify-center shadow-lg border border-blue-300/50"
      >
        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Rating Dialog */}
      <RatingDialog
        open={showRating}
        onClose={handleRatingClose}
        therapistId={selectedTherapistId}
        sessionId={sessionId}
      />
    </div>
  );
};

export default VideoChat;
