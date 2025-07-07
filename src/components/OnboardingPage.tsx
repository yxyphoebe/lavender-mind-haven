import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Star, CheckCircle, ArrowLeft, ArrowRight, MessageSquare, Coffee, FileText, Sunset, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateTherapistRecommendations } from '@/utils/therapistRecommendation';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  question: string;
  options: Array<{
    id: string;
    label: string;
    description?: string;
    icon?: any;
  }>;
  multiSelect?: boolean;
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "When you're going through something, how do you usually process it?",
      description: "Understanding your natural processing style helps us support you better",
      question: "Select all that apply to you:",
      multiSelect: true,
      options: [
        { id: 'talk-emotions', label: "I need to talk it out, emotions first.", icon: MessageSquare },
        { id: 'logical-thinking', label: "I try to stay logical and figure it out in my head.", icon: Brain },
        { id: 'hold-until-break', label: "I hold it in until I break.", icon: Heart },
        { id: 'understanding-without-explaining', label: "I just need someone who gets it without needing me to explain much.", icon: Star }
      ]
    },
    {
      id: 1,
      title: "Which of these do you relate to most right now?",
      description: "This helps us understand what you're going through at the moment",
      question: "Choose all that resonate with you:",
      multiSelect: true,
      options: [
        { id: 'emotionally-overwhelmed', label: "I feel emotionally overwhelmed or lost.", icon: Heart },
        { id: 'stuck-decisions', label: "I'm stuck in work/life decisions and don't know the next step.", icon: Brain },
        { id: 'breakup-identity', label: "I'm going through a breakup or identity shift.", icon: Star },
        { id: 'quiet-emptiness', label: "I feel a quiet emptiness I can't name.", icon: MessageSquare },
        { id: 'need-non-judgmental', label: "I just want someone to talk to who won't judge me.", icon: Lightbulb }
      ]
    },
    {
      id: 2,
      title: "What kind of support would feel most comforting to you now?",
      description: "We'll match you with a companion that provides the right kind of energy",
      question: "Select all support styles that appeal to you:",
      multiSelect: true,
      options: [
        { id: 'warm-motherly', label: "Warm, motherly energy — someone who really listens and holds space.", icon: Heart },
        { id: 'calm-grounded', label: "Someone who helps me stay calm and grounded.", icon: Brain },
        { id: 'positive-uplifting', label: "Someone full of life and positivity who lifts me up.", icon: Star },
        { id: 'thoughtful-explorer', label: "A thoughtful friend to explore things with me.", icon: MessageSquare },
        { id: 'clear-insightful', label: "Someone clear, insightful, and emotionally mature.", icon: Lightbulb }
      ]
    },
    {
      id: 3,
      title: "If you had to choose a vibe right now...",
      description: "Your preferred atmosphere tells us about your current emotional needs",
      question: "Select all that feel appealing:",
      multiSelect: true,
      options: [
        { id: 'cozy-tea', label: "Cozy tea and a soft blanket", icon: Coffee },
        { id: 'clean-desk', label: "Clean desk and a fresh to-do list", icon: FileText },
        { id: 'sunny-walk', label: "Wind in your hair on a sunny walk", icon: Sunset },
        { id: 'candlelit-journal', label: "A candle-lit journal night", icon: Heart },
        { id: 'wise-conversation', label: "A quiet conversation with a wise elder", icon: Lightbulb }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    const stepAnswers = answers[currentStep] || [];
    
    if (currentStepData.multiSelect) {
      if (stepAnswers.includes(optionId)) {
        setAnswers({
          ...answers,
          [currentStep]: stepAnswers.filter(id => id !== optionId)
        });
      } else {
        setAnswers({
          ...answers,
          [currentStep]: [...stepAnswers, optionId]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentStep]: [optionId]
      });
    }
  };

  const isOptionSelected = (optionId: string) => {
    return answers[currentStep]?.includes(optionId) || false;
  };

  const canProceed = () => {
    const stepAnswers = answers[currentStep];
    return stepAnswers && stepAnswers.length > 0;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete - calculate recommendations
      console.log('Onboarding completed with answers:', answers);
      
      const recommendations = calculateTherapistRecommendations(answers);
      console.log('Top 3 therapist recommendations:', recommendations);
      
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
      localStorage.setItem('therapistRecommendations', JSON.stringify(recommendations));
      
      navigate('/persona-selection');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-violet-400 rounded-xl flex items-center justify-center zen-shadow">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-xl font-bold text-neutral-800 mb-1">
            Let's personalize your journey
          </h1>
          <p className="text-slate-600 font-light text-sm mb-4">
            A few questions to help us understand you better
          </p>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 zen-shadow mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800 text-center">
              {currentStepData.title}
            </CardTitle>
            <p className="text-slate-600 text-xs text-center">
              {currentStepData.description}
            </p>
            <p className="font-medium text-slate-800 text-sm mt-2 text-center">
              {currentStepData.question}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {currentStepData.options.map((option) => {
                const IconComponent = option.icon;
                const isSelected = isOptionSelected(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50 zen-shadow'
                        : 'border-blue-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {IconComponent && (
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          isSelected ? 'bg-blue-400 text-white' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <IconComponent className="w-3 h-3" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-800 text-sm">
                            {option.label}
                          </h4>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        {option.description && (
                          <p className="text-xs text-slate-600 mt-1">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentStepData.multiSelect && (
              <div className="mt-3 text-center">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  You can select multiple options
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 border-blue-200 hover:bg-blue-50 bg-white text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 text-sm ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
