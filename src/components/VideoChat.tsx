
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { useTavusVideo } from '@/hooks/useTavusVideo';



import DailyVideoCall from './DailyVideoCall';
import FullScreenBackdrop from './FullScreenBackdrop';
import RatingDialog from './RatingDialog';

const VideoChat = () => {
  const navigate = useNavigate();
  
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


  const handleStartCall = async () => {
    if (!therapist) {
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

  // Preload therapist image for seamless transition
  useEffect(() => {
    if (therapist?.image_url) {
      const img = new Image();
      img.src = therapist.image_url;
    }
  }, [therapist?.image_url]);

  // If in call, show the Daily video interface
  if (isInCall && roomUrl) {
    return <DailyVideoCall roomUrl={roomUrl} onLeave={handleLeaveCall} therapist={therapist} />;
  }

  // Pre-call minimal interface
  return (
    <div className="h-screen w-screen bg-background">
      <FullScreenBackdrop 
        imageUrl={therapist?.image_url}
        name={therapist?.name}
        showLoading
        error={!!error}
        onRetry={error ? handleStartCall : undefined}
      />

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
