import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import MindfulLogo from './MindfulLogo';

interface VideoSplashScreenProps {
  onVideoEnd: () => void;
}

const VideoSplashScreen = ({ onVideoEnd }: VideoSplashScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showBranding, setShowBranding] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
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
      // Show branding after 1 second
      setTimeout(() => setShowBranding(true), 1000);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    const handleEnded = () => {
      // Start transition effect
      setShowTransition(true);
      // Complete transition after animation
      setTimeout(() => onVideoEnd(), 800);
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
    setShowTransition(true);
    setTimeout(() => onVideoEnd(), 300);
  };

  if (hasError) {
    return null; // Fallback to main content
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleSkip}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        } ${showTransition ? 'opacity-30 scale-110' : ''}`}
        muted
        playsInline
        preload="auto"
        src={videoUrl}
      />

      {/* Gradient Overlay for Smooth Transition */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showTransition ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--mindful-600)) 0%, hsl(var(--mindful-400)) 50%, hsl(250 25% 85%) 100%)'
        }}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      
      {/* Brand Overlay */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-1000 ${
        showBranding ? 'opacity-100' : 'opacity-0'
      } ${showTransition ? 'scale-110 opacity-90' : ''}`}>
        
        {/* Logo */}
        <div className="flex flex-col items-center space-y-6">
          <div className={`transition-all duration-700 ${showBranding ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <MindfulLogo size="xl" className="drop-shadow-2xl" />
          </div>
          
          {/* Brand Text */}
          <div className={`text-center transition-all duration-700 delay-300 ${
            showBranding ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              Mindful AI
            </h1>
            <p className="text-white/90 text-lg font-light drop-shadow-md">
              Your mindful companion awaits
            </p>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      {!isLoading && !showTransition && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70 z-20 animate-fade-in">
          点击跳过
        </div>
      )}

      {/* Ambient particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-gentle-float" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-gentle-float-slow" />
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-gentle-float-ultra-slow" />
      </div>
    </div>
  );
};

export default VideoSplashScreen;