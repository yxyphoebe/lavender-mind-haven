import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageCircle, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedbackChatLogic } from '@/hooks/useFeedbackChatLogic';
import EmbeddedMessageList from '@/components/EmbeddedMessageList';
import EmbeddedChatInput from '@/components/EmbeddedChatInput';

const ImprovementFeedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Assistant feedback chat functionality
  const {
    messages,
    inputValue,
    isTyping,
    setInputValue,
    handleSendMessage,
    initializeChatWithContext
  } = useFeedbackChatLogic();

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeChatWithContext("Hello! I'm here to help you share feedback about your experience with the app. Feel free to tell me about anything you like, any suggestions you have, or any concerns you'd like to discuss.");
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initializeChatWithContext]);

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

        {/* AI Assistant Chat */}
        <Card className="mb-4 bg-white rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-bold text-slate-800 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
              Chat with Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <EmbeddedMessageList
                  messages={messages}
                  therapist={{
                    name: 'Assistant',
                    image_url: undefined
                  }}
                  isTyping={isTyping}
                />
              </div>
              
              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <EmbeddedChatInput
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                />
              </div>
            </div>
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