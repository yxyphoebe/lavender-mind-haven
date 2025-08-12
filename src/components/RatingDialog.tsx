import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  therapistId?: string;
  sessionId?: string;
}

const RatingDialog = ({ open, onClose, therapistId, sessionId }: RatingDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRating = async (rating: 'thumbs_up' | 'thumbs_down') => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('conversation_ratings')
        .insert({
          user_id: user.id,
          therapist_id: therapistId,
          session_id: sessionId,
          rating
        });

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded.",
      });

      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-5 sm:rounded-2xl bg-background/50 backdrop-blur-md border border-border/50 shadow-lg animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-foreground">
            How do you feel about this talk?
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-5 py-5">
          <div className="flex space-x-6">
            <Button
              onClick={() => handleRating('thumbs_up')}
              disabled={isSubmitting}
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <ThumbsUp className="w-8 h-8" />
              <span className="text-sm text-foreground">Good</span>
            </Button>
            
            <Button
              onClick={() => handleRating('thumbs_down')}
              disabled={isSubmitting}
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-destructive/10 transition-colors"
            >
              <ThumbsDown className="w-8 h-8" />
              <span className="text-sm text-foreground">Not Good</span>
            </Button>
          </div>
          
          <Button
            onClick={handleSkip}
            disabled={isSubmitting}
            variant="outline"
            className="text-xs px-4 py-2 rounded-full border-border/60 text-muted-foreground hover:bg-background/60"
          >
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;