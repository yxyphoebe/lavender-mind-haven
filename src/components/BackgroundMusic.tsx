
import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type BackgroundMusicProps = {
  url?: string | null;
  className?: string;
  volume?: number; // 0.0 - 1.0
  onUserInteractionNeeded?: () => void;
};

const BackgroundMusic = ({ url, className, volume = 0.2, onUserInteractionNeeded }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const hasUserInteracted = useRef(false);
  
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  const clearFadeTimer = () => {
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const attemptAutoplay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // On mobile, don't attempt autoplay without user interaction
    if (isMobile && !hasUserInteracted.current) {
      console.log('[BackgroundMusic] mobile detected, waiting for user interaction');
      setNeedsUserInteraction(true);
      onUserInteractionNeeded?.();
      return;
    }

    try {
      audio.volume = volume;
      await audio.play();
      setIsPlaying(true);
      setNeedsUserInteraction(false);
      console.log('[BackgroundMusic] autoplay success');
    } catch (e) {
      console.warn('[BackgroundMusic] autoplay blocked', e);
      setIsPlaying(false);
      if (isMobile) {
        setNeedsUserInteraction(true);
        onUserInteractionNeeded?.();
      }
    }
  };

  const playOnUserInteraction = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    hasUserInteracted.current = true;
    setNeedsUserInteraction(false);

    try {
      audio.volume = volume;
      await audio.play();
      setIsPlaying(true);
      console.log('[BackgroundMusic] user interaction play success');
    } catch (e) {
      console.warn('[BackgroundMusic] user interaction play failed', e);
      setIsPlaying(false);
    }
  }, [url, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    console.log('[BackgroundMusic] init with url:', url);
    audio.src = url;
    audio.loop = true;
    audio.preload = 'auto';

    // reset state for new url
    setIsPlaying(false);
    setNeedsUserInteraction(false);

    attemptAutoplay();

    return () => {
      if (audio) {
        console.log('[BackgroundMusic] cleanup: pause');
        audio.pause();
      }
      clearFadeTimer();
      setIsPlaying(false);
      setNeedsUserInteraction(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Expose the play function for external use
  useEffect(() => {
    (window as any).__backgroundMusicPlay = playOnUserInteraction;
    return () => {
      delete (window as any).__backgroundMusicPlay;
    };
  }, [playOnUserInteraction]);

  // If the volume prop changes while playing, apply it
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.volume = volume;
    }
  }, [volume, isPlaying]);


  if (!url) return null;

  return (
    <div className={cn('pointer-events-none', className)}>
      <audio ref={audioRef} src={url || undefined} className="hidden" playsInline />

      {/* Optional tiny status for debugging */}
      <div className="hidden">
        {isPlaying ? 'playing' : needsUserInteraction ? 'waiting-interaction' : 'paused'}
      </div>
    </div>
  );
};

export default BackgroundMusic;
