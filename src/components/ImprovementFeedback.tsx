import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleFeedbackChat from '@/components/SimpleFeedbackChat';

const ImprovementFeedback = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleScheduleCall = () => {
    // Open external scheduling link
    window.open('https://calendly.com/hello-mindfulai/chat-with-mindful-ai', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-md">
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

        {/* Welcome Message */}
        <div className="mb-6 text-center">
          <p className="text-slate-700 text-base leading-relaxed">
            Hi, I'm here to listen 👋 Share any thoughts or suggestions about your experience.
          </p>
        </div>

        {/* Direct Chat Component */}
        <div className="mb-6">
          <SimpleFeedbackChat />
        </div>

        {/* Lightweight Schedule Call Option */}
        <div className="mb-8 text-center">
          <p className="text-slate-500 text-sm mb-2">
            Prefer a real conversation? →
          </p>
          <Button
            onClick={handleScheduleCall}
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-300 hover:bg-slate-50"
          >
            Schedule a Call
          </Button>
        </div>

        {/* Thank You Message - Bottom */}
        <div className="text-center">
          <p className="text-slate-400 text-xs">
            ✨ Your feedback makes the app better for everyone. Thank you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovementFeedback;