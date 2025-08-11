
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BackgroundMusicProps = {
  url?: string | null;
  className?: string;
  volume?: number; // 0.0 - 1.0
};

const BackgroundMusic = ({ url, className, volume = 0.2 }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    console.log('[BackgroundMusic] init with url:', url);
    audio.src = url;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;

    const tryPlay = async () => {
      try {
        await audio.play();
        setAutoplayBlocked(false);
        setIsPlaying(true);
        console.log('[BackgroundMusic] autoplay success');
      } catch (e) {
        console.warn('[BackgroundMusic] autoplay blocked', e);
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
    };

    tryPlay();

    return () => {
      if (audio) {
        console.log('[BackgroundMusic] cleanup: pause');
        audio.pause();
      }
      setIsPlaying(false);
      setAutoplayBlocked(false);
    };
  }, [url, volume]);

  const handleManualPlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setAutoplayBlocked(false);
      setIsPlaying(true);
      console.log('[BackgroundMusic] manual play success');
    } catch (e) {
      console.error('[BackgroundMusic] manual play failed', e);
    }
  };

  if (!url) return null;

  return (
    <div className={cn('pointer-events-none', className)}>
      <audio ref={audioRef} src={url || undefined} className="hidden" playsInline />
      {autoplayBlocked && (
        <div className="pointer-events-auto fixed bottom-6 left-6 z-50">
          <Button
            onClick={handleManualPlay}
            variant="ghost"
            className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 text-white shadow-md hover:scale-105 transition-all"
          >
            播放音乐
          </Button>
        </div>
      )}
      {/* Optional tiny status for debugging */}
      <div className="hidden">{isPlaying ? 'playing' : 'paused'}</div>
    </div>
  );
};

export default BackgroundMusic;
