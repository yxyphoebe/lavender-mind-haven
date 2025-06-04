
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Flower2, ChevronRight, ChevronLeft, Heart, Target, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    language: '',
    currentGoals: '',
    emotionalState: '',
    preferredSupport: ''
  });
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/persona-selection');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold text-sage-800 mb-2">
                Let's get to know you
              </h2>
              <p className="text-sage-600">
                Help us personalize your wellness journey
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  What should we call you?
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Your name"
                  className="h-12 border-sky-200 rounded-xl focus:ring-sky-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Preferred language
                </label>
                <Select value={formData.language} onValueChange={(value) => updateFormData('language', value)}>
                  <SelectTrigger className="h-12 border-sky-200 rounded-xl">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-sky-200">
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                    <SelectItem value="german">Deutsch</SelectItem>
                    <SelectItem value="portuguese">Português</SelectItem>
                    <SelectItem value="chinese">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Target className="w-12 h-12 text-sky-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold text-sage-800 mb-2">
                What brings you here today?
              </h2>
              <p className="text-sage-600">
                Share what you'd like to work on (optional)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Current goals or challenges
              </label>
              <Textarea
                value={formData.currentGoals}
                onChange={(e) => updateFormData('currentGoals', e.target.value)}
                placeholder="e.g., Managing stress, improving self-confidence, processing difficult emotions..."
                className="min-h-[120px] border-sky-200 rounded-xl focus:ring-sky-400 resize-none"
              />
              <p className="text-xs text-sage-500 mt-2">
                This helps us understand how to best support you
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Smile className="w-12 h-12 text-sage-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold text-sage-800 mb-2">
                How are you feeling lately?
              </h2>
              <p className="text-sage-600">
                Help us understand your current emotional state
              </p>
            </div>
            
            <div className="grid gap-3">
              {[
                { value: 'great', label: 'Great - feeling positive and energized', emoji: '😊' },
                { value: 'good', label: 'Good - generally feeling well', emoji: '🙂' },
                { value: 'neutral', label: 'Neutral - feeling okay, nothing special', emoji: '😐' },
                { value: 'struggling', label: 'Struggling - going through some challenges', emoji: '😔' },
                { value: 'difficult', label: 'Having a difficult time', emoji: '😞' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('emotionalState', option.value)}
                  className={`p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                    formData.emotionalState === option.value
                      ? 'border-sky-400 bg-sky-50'
                      : 'border-sky-200 hover:border-sky-300 hover:bg-sky-25'
                  }`}
                >
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  <span className="text-sage-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Flower2 className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold text-sage-800 mb-2">
                How do you prefer support?
              </h2>
              <p className="text-sage-600">
                This helps us match you with the right AI companion
              </p>
            </div>
            
            <div className="grid gap-3">
              {[
                { value: 'gentle', label: 'Gentle and nurturing approach', desc: 'Soft encouragement with lots of empathy' },
                { value: 'direct', label: 'Direct and solution-focused', desc: 'Clear guidance with practical steps' },
                { value: 'balanced', label: 'Balanced mix of both', desc: 'Empathy combined with actionable advice' },
                { value: 'adaptive', label: 'Adaptive to my needs', desc: 'Adjusts approach based on the situation' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('preferredSupport', option.value)}
                  className={`p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                    formData.preferredSupport === option.value
                      ? 'border-sky-400 bg-sky-50'
                      : 'border-sky-200 hover:border-sky-300 hover:bg-sky-25'
                  }`}
                >
                  <div className="font-medium text-sage-700 mb-1">{option.label}</div>
                  <div className="text-sm text-sage-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-rose-400 rounded-2xl flex items-center justify-center mindful-shadow">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            Welcome to Mindful AI
          </h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-sage-500">
            <span>Step {currentStep} of {totalSteps}</span>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep ? 'bg-sky-400' : 'bg-sky-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Card */}
        <Card className="glass-effect border-0 mindful-shadow">
          <CardHeader>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </CardHeader>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-sky-200 text-sky-700 hover:bg-sky-50 rounded-xl px-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl px-6"
          >
            {currentStep === totalSteps ? 'Continue' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Skip option */}
        {currentStep > 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/persona-selection')}
              className="text-sm text-sage-500 hover:text-sage-700 underline transition-colors"
            >
              Skip remaining questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
