import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Play, Loader2 } from 'lucide-react';
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

  const handleVideoClick = () => {
    if (videoRef.current && !hasStarted) {
      setHasStarted(true);
      videoRef.current.play().catch(() => {
        setHasVideoError(true);
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

  // If no video URL or video failed to load, show avatar
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
      {/* Video background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-mindful-400/30 to-enso-500/30 rounded-xl blur-xl scale-110"></div>
      
      {/* Video container */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bloom-shadow ring-4 ring-white/50">
        {/* Loading state */}
        {isVideoLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-mindful-100 to-enso-100 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-mindful-400" />
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover cursor-pointer"
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onEnded={handleVideoEnded}
          onClick={handleVideoClick}
        />

        {/* Play button overlay when video hasn't started */}
        {!hasStarted && !isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={handleVideoClick}
              className="w-16 h-16 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
        )}

        {/* Replay button when video has ended */}
        {hasEnded && !isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={handleReplay}
              className="w-16 h-16 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};