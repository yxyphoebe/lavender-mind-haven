import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface VideoSplashScreenProps {
  onVideoEnd: () => void;
}

const VideoSplashScreen = ({ onVideoEnd }: VideoSplashScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const videoUrl = "https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/open-video/lotus.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      video.play().catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    const handleEnded = () => {
      onVideoEnd();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd]);

  const handleSkip = () => {
    onVideoEnd();
  };

  if (hasError) {
    return null; // Fallback to main content
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer"
      onClick={handleSkip}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        muted
        playsInline
        preload="auto"
        src={videoUrl}
      />
      
      {!isLoading && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
          点击跳过
        </div>
      )}
    </div>
  );
};

export default VideoSplashScreen;