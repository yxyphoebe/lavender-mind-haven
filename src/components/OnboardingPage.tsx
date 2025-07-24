import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Star, CheckCircle, ArrowLeft, ArrowRight, MessageSquare, Coffee, FileText, Sunset, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateTherapistRecommendations } from '@/utils/therapistRecommendation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Get current user
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

        // Calculate recommendations
        const recommendations = calculateTherapistRecommendations(answers);
        console.log('Onboarding completed with answers:', answers);
        console.log('Top 3 therapist recommendations:', recommendations);
        
        // Prepare onboarding responses for database
        const onboardingResponses = [];
        Object.entries(answers).forEach(([stepIndex, selectedOptions]) => {
          const step = steps[parseInt(stepIndex)];
          selectedOptions.forEach(optionId => {
            const option = step.options.find(opt => opt.id === optionId);
            if (option) {
              onboardingResponses.push({
                user_id: user.id,
                question_key: optionId,
                question_text: step.title,
                answer_value: option.label,
                answer_weight: 1
              });
            }
          });
        });

        // Save to Supabase
        const { error: responsesError } = await supabase
          .from('onboarding_responses')
          .insert(onboardingResponses);

        if (responsesError) {
          console.error('Error saving onboarding responses:', responsesError);
        }

        // Update user completion status
        const { error: userError } = await supabase
          .from('users')
          .update({ 
            onboarding_completed: true,
            last_active: new Date().toISOString()
          })
          .eq('id', user.id);

        if (userError) {
          console.error('Error updating user status:', userError);
        }

        // Get therapist IDs from database to save recommendations
        const { data: therapists } = await supabase
          .from('therapists')
          .select('id, name');

        if (therapists && therapists.length > 0) {
          const recommendationData = recommendations
            .map(rec => {
              const therapist = therapists.find(t => t.name === rec.name);
              if (therapist) {
                return {
                  user_id: user.id,
                  therapist_id: therapist.id,
                  recommendation_score: rec.score,
                  reasoning: { rank: rec.rank, answers: answers }
                };
              }
              return null;
            })
            .filter(Boolean);

          if (recommendationData.length > 0) {
            const { error: recsError } = await supabase
              .from('therapist_recommendations')
              .insert(recommendationData);

            if (recsError) {
              console.error('Error saving recommendations:', recsError);
            }
          }
        }

        // Keep localStorage for backwards compatibility
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
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
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Title - Question */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 leading-tight">
            {currentStepData.question}
          </h1>
        </div>

        {/* Options with Image Placeholders */}
        <div className="space-y-6 mb-12">
          {currentStepData.options.map((option) => {
            const isSelected = isOptionSelected(option.id);
            
            return (
              <div
                key={option.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-blue-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-800 text-lg">
                    {option.label}
                  </h3>
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                
                {/* Two Image Placeholders */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Image 1</div>
                  </div>
                  <div className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Image 2</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar at Bottom */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
