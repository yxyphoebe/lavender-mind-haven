import React from 'react';
import { cn } from '@/lib/utils';

interface FullScreenBackdropProps {
  imageUrl?: string;
  name?: string;
  showLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  className?: string;
}

const FullScreenBackdrop: React.FC<FullScreenBackdropProps> = ({
  imageUrl,
  name,
  showLoading = false,
  error = false,
  onRetry,
  className = '',
}) => {
  return (
    <section
      className={cn(
        'fixed inset-0 overflow-hidden bg-background',
        error ? 'cursor-pointer' : 'cursor-default',
        className
      )}
      onClick={error ? onRetry : undefined}
      aria-live="polite"
      role={showLoading ? 'status' : undefined}
    >
      {/* Background image or gradient */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name ? `${name} background` : 'Background'}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background" />
      )}

      {/* Subtle shadow/overlay for readability */}
      <div className="absolute inset-0 bg-background/30" />

      {/* Loading indicator */}
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 shadow-lg animate-fade-in">
            <span className="sr-only">Connecting...</span>
            <span className="w-2.5 h-2.5 rounded-full bg-foreground/80 pulse" style={{ animationDelay: '0s' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-foreground/80 pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-foreground/80 pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </section>
  );
};

export default FullScreenBackdrop;
