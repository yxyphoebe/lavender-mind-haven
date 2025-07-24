import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateTherapistRecommendations } from '@/utils/therapistRecommendation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: number;
  question: string;
  options: Array<{
    id: string;
  }>;
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: 0,
      question: "When you're going through something, how do you usually process it?",
      options: [
        { id: 'talk-emotions' },
        { id: 'logical-thinking' }
      ]
    },
    {
      id: 1,
      question: "Which of these do you relate to most right now?",
      options: [
        { id: 'emotionally-overwhelmed' },
        { id: 'stuck-decisions' }
      ]
    },
    {
      id: 2,
      question: "What kind of support would feel most comforting to you now?",
      options: [
        { id: 'warm-motherly' },
        { id: 'calm-grounded' }
      ]
    },
    {
      id: 3,
      question: "If you had to choose a vibe right now...",
      options: [
        { id: 'cozy-tea' },
        { id: 'clean-desk' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];

  const handleOptionSelect = async (optionId: string) => {
    // Save answer
    setAnswers({
      ...answers,
      [currentStep]: [optionId]
    });

    // Auto-advance after small delay
    setTimeout(async () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            toast({
              title: "Authentication Required",
              description: "Please log in to complete onboarding",
              variant: "destructive",
            });
            navigate('/auth');
            return;
          }

          const finalAnswers = { ...answers, [currentStep]: [optionId] };
          const recommendations = calculateTherapistRecommendations(finalAnswers);
          
          localStorage.setItem('onboardingComplete', 'true');
          localStorage.setItem('onboardingAnswers', JSON.stringify(finalAnswers));
          localStorage.setItem('therapistRecommendations', JSON.stringify(recommendations));
          
          toast({
            title: "Onboarding Complete!",
            description: "Your preferences have been saved successfully",
          });
          
          navigate('/persona-selection');
        } catch (error) {
          console.error('Error completing onboarding:', error);
          toast({
            title: "Error",
            description: "Failed to save your preferences. Please try again.",
            variant: "destructive",
          });
        }
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-white to-enso-50 flex flex-col p-6">
      {/* Back Button - Top Left */}
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {/* Question Title */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-16 leading-relaxed">
          {currentStepData.question}
        </h1>

        {/* Image Options - Vertical Layout */}
        <div className="w-full space-y-6">
          {currentStepData.options.map((option, index) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className="w-full aspect-[4/3] bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="text-gray-400 text-lg font-medium">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;