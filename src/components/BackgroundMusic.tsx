
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type BackgroundMusicProps = {
  url?: string | null;
  className?: string;
  volume?: number; // 0.0 - 1.0
};

const BackgroundMusic = ({ url, className, volume = 0.2 }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const clearFadeTimer = () => {
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const attemptAutoplay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = volume;
      await audio.play();
      setIsPlaying(true);
      console.log('[BackgroundMusic] autoplay success');
    } catch (e) {
      console.warn('[BackgroundMusic] autoplay blocked', e);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    console.log('[BackgroundMusic] init with url:', url);
    audio.src = url;
    audio.loop = true;
    audio.preload = 'auto';

    // reset state for new url
    setIsPlaying(false);

    attemptAutoplay();

    return () => {
      if (audio) {
        console.log('[BackgroundMusic] cleanup: pause');
        audio.pause();
      }
      clearFadeTimer();
      setIsPlaying(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

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
      <div className="hidden">{isPlaying ? 'playing' : 'paused'}</div>
    </div>
  );
};

export default BackgroundMusic;
