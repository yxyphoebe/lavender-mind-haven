import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Heart, Star } from 'lucide-react';
import { useState } from 'react';

interface TherapistExperienceProps {
  currentTherapist: string;
  onSubmit: () => void;
  onBack: () => void;
}

const TherapistExperience = ({ currentTherapist, onSubmit, onBack }: TherapistExperienceProps) => {
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    // Simulate API call to save feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm hover:from-blue-100 hover:to-purple-100 shadow-lg border border-blue-100"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </Button>
          
          <h1 className="font-display text-xl font-bold text-neutral-800">
            Tell us about {currentTherapist}
          </h1>
          
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* Experience Form */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-lg font-bold text-slate-800 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-rose-400" />
              Your Experience with {currentTherapist}
            </CardTitle>
            <p className="text-slate-600 text-sm">
              Before switching to a new therapist, we'd love to hear about your experience. This helps us improve our matching system.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                How would you rate your overall experience?
              </Label>
              <RadioGroup value={rating} onValueChange={setRating} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-white transition-colors">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent" className="flex items-center space-x-2 cursor-pointer">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span>Excellent</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-white transition-colors">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good" className="flex items-center space-x-2 cursor-pointer">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <Star className="w-4 h-4 text-slate-300" />
                    </div>
                    <span>Good</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-white transition-colors">
                  <RadioGroupItem value="average" id="average" />
                  <Label htmlFor="average" className="flex items-center space-x-2 cursor-pointer">
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      {[4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-slate-300" />
                      ))}
                    </div>
                    <span>Average</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-white transition-colors">
                  <RadioGroupItem value="poor" id="poor" />
                  <Label htmlFor="poor" className="flex items-center space-x-2 cursor-pointer">
                    <div className="flex space-x-1">
                      {[1, 2].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      {[3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-slate-300" />
                      ))}
                    </div>
                    <span>Poor</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Feedback */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                What did you like or dislike? (Optional)
              </Label>
              <Textarea
                placeholder="Share your thoughts about the communication style, helpfulness, or anything else..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-24 border-blue-200 rounded-xl focus:ring-blue-400 bg-white resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl font-medium transition-all duration-300"
            >
              {isSubmitting ? 'Saving...' : 'Continue to Therapist Selection'}
            </Button>
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 zen-shadow">
          <CardContent className="p-4">
            <p className="text-amber-800 text-sm">
              💡 Your feedback is confidential and helps us improve the matching process for you and other users.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistExperience;