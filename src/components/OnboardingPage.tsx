
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Star, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      title: "What brings you here today?",
      description: "Understanding your goals helps us personalize your experience",
      question: "What would you like to focus on? (Select all that apply)",
      multiSelect: true,
      options: [
        { id: 'stress', label: 'Managing stress & anxiety', icon: Brain },
        { id: 'emotional', label: 'Processing emotions', icon: Heart },
        { id: 'growth', label: 'Personal growth', icon: Star },
        { id: 'relationships', label: 'Improving relationships', icon: Heart },
        { id: 'confidence', label: 'Building confidence', icon: Star },
        { id: 'mindfulness', label: 'Developing mindfulness', icon: Brain }
      ]
    },
    {
      id: 1,
      title: "How familiar are you with therapy or counseling?",
      description: "This helps us adjust our approach to your comfort level",
      question: "Select the option that best describes you:",
      options: [
        { id: 'new', label: "I'm completely new to this" },
        { id: 'some', label: "I have some experience" },
        { id: 'experienced', label: "I'm quite experienced" }
      ]
    },
    {
      id: 2,
      title: "What's your preferred communication style?",
      description: "We'll match you with an AI companion that fits your preferences",
      question: "How do you prefer to receive support?",
      options: [
        { id: 'gentle', label: "Gentle and nurturing" },
        { id: 'direct', label: "Direct and solution-focused" },
        { id: 'balanced', label: "Balanced approach" }
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
      // Onboarding complete
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
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
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-violet-400 rounded-xl flex items-center justify-center zen-shadow">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text mb-2">
            Let's personalize your journey
          </h1>
          <p className="text-slate-600 font-light mb-4">
            A few questions to help us understand you better
          </p>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 zen-shadow mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-800">
              {currentStepData.title}
            </CardTitle>
            <p className="text-slate-600 text-sm">
              {currentStepData.description}
            </p>
            <p className="font-medium text-slate-800 text-sm mt-2">
              {currentStepData.question}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`grid gap-3 ${currentStepData.multiSelect ? 'grid-cols-2' : 'grid-cols-1'}`}>
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
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                          isSelected ? 'bg-blue-400 text-white' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <IconComponent className="w-3 h-3" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-800 text-sm truncate">
                            {option.label}
                          </h4>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        {option.description && !currentStepData.multiSelect && (
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
              <div className="mt-3">
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
            className="flex items-center space-x-2 border-blue-200 hover:bg-blue-50 bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 ${
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
