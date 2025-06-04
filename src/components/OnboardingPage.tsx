
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
        { id: 'new', label: "I'm completely new to this", description: "Never tried therapy or counseling before" },
        { id: 'some', label: "I have some experience", description: "Tried therapy or counseling a few times" },
        { id: 'experienced', label: "I'm quite experienced", description: "Regular therapy experience or extensive self-work" }
      ]
    },
    {
      id: 2,
      title: "What's your preferred communication style?",
      description: "We'll match you with an AI companion that fits your preferences",
      question: "How do you prefer to receive support?",
      options: [
        { id: 'gentle', label: "Gentle and nurturing", description: "Soft approach with lots of validation" },
        { id: 'direct', label: "Direct and solution-focused", description: "Clear guidance with actionable steps" },
        { id: 'balanced', label: "Balanced approach", description: "Mix of empathy and practical advice" }
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-blue-400 rounded-2xl flex items-center justify-center zen-shadow">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            Let's personalize your journey
          </h1>
          <p className="text-slate-600 font-light mb-6">
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
        <Card className="glass-effect border-0 zen-shadow mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 mb-2">
              {currentStepData.title}
            </CardTitle>
            <p className="text-slate-600">
              {currentStepData.description}
            </p>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-slate-800 mb-4">
              {currentStepData.question}
            </h3>
            
            <div className="space-y-3">
              {currentStepData.options.map((option) => {
                const IconComponent = option.icon;
                const isSelected = isOptionSelected(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-violet-400 bg-violet-50 zen-shadow'
                        : 'border-violet-200 hover:border-violet-300 hover:bg-blue-25'
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {IconComponent && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-violet-400 text-white' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-800">
                            {option.label}
                          </h4>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-violet-600" />
                          )}
                        </div>
                        {option.description && (
                          <p className="text-sm text-slate-600 mt-1">
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
              <div className="mt-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
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
            className="flex items-center space-x-2 border-violet-200 hover:bg-violet-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 ${
              canProceed()
                ? 'bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white'
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
