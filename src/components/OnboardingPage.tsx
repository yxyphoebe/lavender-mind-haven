import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateTherapistRecommendationsFromDB } from '@/utils/dynamicTherapistRecommendation';
import { useOnboardingQuestions } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: questions, isLoading, error } = useOnboardingQuestions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-white to-enso-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading questions...</div>
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    console.log('Onboarding error:', error);
    console.log('Questions:', questions);
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-white to-enso-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Failed to load questions. Please try again.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  
  console.log('Current question:', currentQuestion);
  console.log('Current question options:', currentQuestion?.options);

  const handleOptionSelect = async (optionValue: string) => {
    // Save answer
    setAnswers({
      ...answers,
      [currentStep]: [optionValue]
    });

    // Auto-advance after small delay
    setTimeout(async () => {
      if (currentStep < questions.length - 1) {
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

          const finalAnswers = { ...answers, [currentStep]: [optionValue] };
          const recommendations = await calculateTherapistRecommendationsFromDB(finalAnswers);
          
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
      <div className="flex-1 flex flex-col items-center pt-20 max-w-lg mx-auto w-full px-4">
        {/* Question Title */}
        <h1 className="text-lg font-medium text-center text-gray-800 mb-10 leading-relaxed">
          {currentQuestion.question_text}
        </h1>

        {/* Image Options - Vertical Layout */}
        <div className="w-full space-y-6">
          {currentQuestion.options.map((option, index) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option.option_value)}
              className="w-full aspect-square bg-gray-100 border-2 border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-lg transition-all duration-200 active:scale-[0.98] relative group"
            >
              {/* Image */}
              {option.image_url ? (
                <div className="absolute inset-0">
                  <img 
                    src={option.image_url} 
                    alt={option.option_value}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('Image loaded:', option.image_url)}
                    onError={(e) => {
                      console.error('Image failed to load:', option.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Light overlay for better text readability */}
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-200" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100" />
              )}
              
              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className={`text-center text-lg font-medium leading-relaxed ${option.image_url ? 'text-white drop-shadow-lg' : 'text-gray-700'}`}>
                  {option.option_value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;