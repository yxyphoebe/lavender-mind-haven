import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImprovementFeedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setFeedback('');
    // Show success message or navigate
  };

  const handleScheduleCall = () => {
    // Open external scheduling link
    window.open('https://calendly.com/your-team/consultation', '_blank');
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

        {/* AI Chat Feedback */}
        <Card className="mb-4 bg-white rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-bold text-slate-800 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
              Share Your Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 text-sm">
              Our AI assistant is here to help us understand your experience better. Share any thoughts, suggestions, or concerns.
            </p>
            
            <Textarea
              placeholder="Tell us about your experience with the app, what you like, what could be improved..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-32 border-gray-200 rounded-xl focus:ring-blue-400 bg-white resize-none"
            />
            
            <Button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim() || isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl font-medium transition-all duration-300"
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Call */}
        <Card className="mb-4 bg-white rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-bold text-slate-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-500" />
              Schedule a Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Want to discuss your experience personally? Schedule a call with our team for more detailed feedback and suggestions.
            </p>
            
            <Button
              onClick={handleScheduleCall}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-medium transition-all duration-300"
            >
              Schedule Call
            </Button>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="bg-white rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <p className="text-amber-800 text-sm font-medium">
              💡 Your feedback helps us improve the app for everyone. Thank you for taking the time to share your thoughts!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImprovementFeedback;