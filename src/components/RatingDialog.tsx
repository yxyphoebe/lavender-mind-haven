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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-mindful-800">
            How do you feel about this talk?
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="flex space-x-8">
            <Button
              onClick={() => handleRating('thumbs_up')}
              disabled={isSubmitting}
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-6 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <ThumbsUp className="w-12 h-12" />
              <span className="text-sm font-medium">Good</span>
            </Button>
            
            <Button
              onClick={() => handleRating('thumbs_down')}
              disabled={isSubmitting}
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-6 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <ThumbsDown className="w-12 h-12" />
              <span className="text-sm font-medium">Not Good</span>
            </Button>
          </div>
          
          <Button
            onClick={handleSkip}
            disabled={isSubmitting}
            variant="outline"
            className="text-sm text-mindful-600 hover:text-mindful-700"
          >
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;