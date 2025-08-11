
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type BackgroundMusicProps = {
  url?: string | null;
  className?: string;
  volume?: number; // 0.0 - 1.0
};

const BackgroundMusic = ({ url, className, volume = 0.2 }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

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
      audio.volume = volume; // normal volume for successful autoplay
      await audio.play();
      setAutoplayBlocked(false);
      setIsPlaying(true);
      setDialogOpen(false);
      console.log('[BackgroundMusic] autoplay success');
    } catch (e) {
      console.warn('[BackgroundMusic] autoplay blocked', e);
      setAutoplayBlocked(true);
      setIsPlaying(false);
      // Only open dialog if not previously dismissed in this session
      if (!dismissed) {
        setDialogOpen(true);
      }
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
    setAutoplayBlocked(false);
    setDialogOpen(false);
    setDismissed(false);

    attemptAutoplay();

    return () => {
      if (audio) {
        console.log('[BackgroundMusic] cleanup: pause');
        audio.pause();
      }
      clearFadeTimer();
      setIsPlaying(false);
      setAutoplayBlocked(false);
      setDialogOpen(false);
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

  const playWithFadeIn = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      clearFadeTimer();
      // start with zero volume then fade to target
      audio.volume = 0;
      await audio.play();
      setAutoplayBlocked(false);
      setIsPlaying(true);
      console.log('[BackgroundMusic] manual play success (fade-in)');

      const target = Math.max(0, Math.min(1, volume));
      const durationMs = 1000;
      const steps = 20;
      const step = target / steps;
      const stepTime = durationMs / steps;

      let current = 0;
      fadeIntervalRef.current = window.setInterval(() => {
        current += step;
        if (audio) {
          audio.volume = Math.min(current, target);
        }
        if (current >= target) {
          clearFadeTimer();
        }
      }, stepTime);
    } catch (e) {
      console.error('[BackgroundMusic] manual play failed', e);
    }
  };

  const handleAllowPlay = async () => {
    setDialogOpen(false);
    await playWithFadeIn();
  };

  const handleLater = () => {
    setDialogOpen(false);
    setDismissed(true);
  };

  if (!url) return null;

  return (
    <div className={cn('pointer-events-none', className)}>
      <audio ref={audioRef} src={url || undefined} className="hidden" playsInline />

      {/* Autoplay blocked dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="pointer-events-auto bg-white/80 backdrop-blur-md border border-white/30">
          <DialogHeader>
            <DialogTitle>需要您的授权播放音乐</DialogTitle>
            <DialogDescription>
              我们希望为你播放舒缓音乐，点击允许开始播放。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={handleLater}>
              稍后
            </Button>
            <Button onClick={handleAllowPlay}>
              允许播放
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Optional tiny status for debugging */}
      <div className="hidden">{isPlaying ? 'playing' : 'paused'}</div>
    </div>
  );
};

export default BackgroundMusic;
