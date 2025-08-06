import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Play, Loader2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoAvatarProps {
  videoUrl?: string | null;
  imageUrl?: string | null;
  name: string;
  className?: string;
  showControls?: boolean;
}

export const VideoAvatar = ({ 
  videoUrl, 
  imageUrl, 
  name, 
  className,
  showControls = true 
}: VideoAvatarProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setHasVideoError(true);
  };

  const handleStartVideo = () => {
    console.log('handleStartVideo called for:', name, 'videoUrl:', videoUrl);
    if (videoRef.current && !hasStarted && videoUrl) {
      console.log('Starting video playback...');
      setHasStarted(true);
      videoRef.current.play().catch((error) => {
        console.error('Video play error:', error);
        setHasVideoError(true);
      });
    } else {
      console.warn('Cannot start video:', { 
        hasVideoRef: !!videoRef.current, 
        hasStarted, 
        hasVideoUrl: !!videoUrl 
      });
    }
  };

  const handleVideoEnded = () => {
    setHasEnded(true);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      setHasEnded(false);
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  // If no video URL or video failed to load, show avatar fallback
  if (!videoUrl || hasVideoError) {
    return (
      <div className={cn("relative", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-mindful-400/30 to-enso-500/30 rounded-xl blur-xl scale-110"></div>
        <Avatar className="relative w-full h-full bloom-shadow ring-4 ring-white/50 rounded-xl">
          <AvatarImage 
            src={imageUrl || ''} 
            alt={`${name} avatar`}
            className="object-cover rounded-xl"
          />
          <AvatarFallback className="bg-gradient-to-br from-mindful-400 to-enso-500 text-white text-5xl rounded-xl">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-mindful-400/30 to-enso-500/30 rounded-xl blur-xl scale-110"></div>
      
      {/* Main container */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bloom-shadow ring-4 ring-white/50">
        
        {/* Static image display (initial state) */}
        {!hasStarted && (
          <div className="relative w-full h-full">
            <Avatar className="w-full h-full rounded-xl">
              <AvatarImage 
                src={imageUrl || ''} 
                alt={`${name} avatar`}
                className="object-cover rounded-xl"
              />
              <AvatarFallback className="bg-gradient-to-br from-mindful-400 to-enso-500 text-white text-5xl rounded-xl">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* Beautiful glassmorphism "Hear from [Name]" button overlay */}
            <div className="absolute inset-0 flex items-end justify-center pb-8 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
              <button
                onClick={(e) => {
                  console.log('Button clicked for:', name);
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartVideo();
                }}
                className="group/btn relative px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out border border-white/30 hover:bg-white/30 hover:border-white/40"
              >
                <div className="flex items-center gap-3 relative z-10">
                  <MessageCircle className="w-5 h-5 group-hover/btn:animate-pulse" />
                  <span className="text-lg font-semibold">Hear from {name}</span>
                </div>
                {/* Glassmorphism inner glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        )}

        {/* Video element (always rendered, visibility controlled by CSS) */}
        <>
          {/* Loading state */}
          {isVideoLoading && hasStarted && (
            <div className="absolute inset-0 bg-gradient-to-br from-mindful-100 to-enso-100 flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-mindful-400" />
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              hasStarted ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            playsInline
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onEnded={handleVideoEnded}
          />

          {/* Replay button when video has ended */}
          {hasEnded && !isVideoLoading && hasStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <button
                onClick={handleReplay}
                className="group/btn relative px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out border border-white/30 hover:bg-white/30"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 ml-0.5 group-hover/btn:animate-pulse" />
                  <span>Watch Again</span>
                </div>
              </button>
            </div>
          )}
        </>
      </div>
    </div>
  );
};