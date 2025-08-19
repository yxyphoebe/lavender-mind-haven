import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleFeedbackChat from '@/components/SimpleFeedbackChat';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useFeedbackAssistant } from '@/hooks/useAssistants';

const ImprovementFeedback = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: feedbackAssistant } = useFeedbackAssistant();


  const handleScheduleCall = () => {
    // Open external scheduling link
    window.open('https://calendly.com/hello-mindfulai/chat-with-mindful-ai', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="container mx-auto px-6 py-8 max-w-md pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-xl bg-white shadow-sm border-0 hover:bg-purple-50 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
        <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Assistant Avatar */}
        <div className="flex justify-center mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage 
              src={feedbackAssistant?.image_url} 
              alt={feedbackAssistant?.name || 'Assistant'} 
            />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-medium">
              {feedbackAssistant?.name?.[0] || 'A'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Direct Chat Component */}
        <div className="mb-12">
          <SimpleFeedbackChat />
        </div>

        {/* Lightweight Schedule Call Option */}
        <div className="mb-8 text-center mt-8">
          <p className="text-slate-500 text-sm mb-3">
            Would you like to chat with our team about your experience?
          </p>
          <Button
            onClick={handleScheduleCall}
            variant="outline"
            size="default"
            className="text-slate-600 border-purple-200 bg-purple-50 hover:bg-purple-100"
          >
            Schedule a Call
          </Button>
        </div>
      </div>

      {/* Thank You Message - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 py-4 text-center">
        <p className="text-slate-400 text-xs">
          ✨ Thanks for being part of the journey.
        </p>
      </div>
    </div>
  );
};

export default ImprovementFeedback;