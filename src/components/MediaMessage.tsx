
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play } from 'lucide-react';

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
          <div className={`relative cursor-pointer rounded-lg overflow-hidden ${className}`}>
            <img
              src={url}
              alt="Shared image"
              className="max-w-xs max-h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <img
            src={url}
            alt="Shared image"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (type === 'video') {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        <video
          src={url}
          controls
          className="max-w-xs max-h-48 rounded-lg"
          onLoadStart={() => setIsLoading(false)}
        >
          您的浏览器不支持视频播放
        </video>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MediaMessage;
