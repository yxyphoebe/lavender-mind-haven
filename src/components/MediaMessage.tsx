
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play, Loader2 } from 'lucide-react';

interface MediaMessageProps {
  url: string;
  type: 'image' | 'video';
  className?: string;
}

const MediaMessage = ({ url, type, className = '' }: MediaMessageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (type === 'image') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className={`relative cursor-pointer rounded-2xl overflow-hidden group ${className}`}>
            <img
              src={url}
              alt="Shared image"
              className="max-w-xs max-h-60 object-cover rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-2xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-2xl" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-xl border-white/50">
          <img
            src={url}
            alt="Shared image"
            className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (type === 'video') {
    return (
      <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
        <video
          src={url}
          controls
          className="max-w-xs max-h-60 rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-lg"
          onLoadStart={() => setIsLoading(false)}
        >
          Your browser does not support video playback
        </video>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-2xl flex items-center justify-center">
            <Play className="w-8 h-8 text-slate-400" />
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MediaMessage;
