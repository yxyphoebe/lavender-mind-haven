import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Play, VolumeX, Volume2, Loader2 } from 'lucide-react';
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
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setHasVideoError(true);
      });
    }
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setHasVideoError(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
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
          muted={isMuted}
          loop
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onClick={handleVideoClick}
        />

        {/* Video controls overlay */}
        {showControls && !isVideoLoading && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 flex items-center justify-center">
            <div className="flex gap-3">
              {/* Play/Pause button */}
              <button
                onClick={handleVideoClick}
                className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                {isPlaying ? (
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                ) : (
                  <Play className="w-5 h-5 ml-1" />
                )}
              </button>

              {/* Mute/Unmute button */}
              <button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Not playing indicator for mobile */}
        {!isPlaying && !isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};