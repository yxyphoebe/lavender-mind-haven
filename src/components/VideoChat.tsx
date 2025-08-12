
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { useTavusVideo } from '@/hooks/useTavusVideo';
import { useToast } from '@/hooks/use-toast';

import { Loader2, Heart, Zap, Star } from 'lucide-react';
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

  // Pre-call minimal interface
  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
      <div
        className={`relative w-40 h-40 rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center ${
          currentPersona.color === 'blue'
            ? 'from-blue-200 to-purple-300'
            : currentPersona.color === 'violet'
              ? 'from-blue-200 to-blue-300'
              : 'from-blue-300 to-purple-200'
        } ${error ? 'cursor-pointer' : ''}`}
        onClick={error ? handleStartCall : undefined}
      >
        {therapist?.image_url ? (
          <img
            src={therapist.image_url}
            alt={therapist.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <IconComponent className="w-20 h-20 text-slate-600" />
        )}

        {isConnecting && (
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center shadow">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

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
