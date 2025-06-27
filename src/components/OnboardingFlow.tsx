
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { questions, responses, loading, saveResponse, submitOnboarding } = useOnboarding();
  const { user, completeOnboarding } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      if (!user) return;

      // Submit onboarding responses
      await submitOnboarding(user.id);
      
      // Navigate to therapist selection
      navigate('/persona-selection');
      
      toast({
        title: "Onboarding Complete!",
        description: "Let's find your perfect soul companion.",
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResponseChange = (value: string) => {
    saveResponse(currentQuestion.key, value);
  };

  const handleMultipleChange = (option: string, checked: boolean) => {
    const currentValues = responses[currentQuestion.key]?.split(',') || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter(v => v !== option);
    }
    
    saveResponse(currentQuestion.key, newValues.join(','));
  };

  const canProceed = responses[currentQuestion.key]?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="text-center">
              <CardTitle className="text-2xl mb-2">Getting to Know You</CardTitle>
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} of {questions.length}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQuestion.text}</h3>
            
            {currentQuestion.type === 'single' && (
              <RadioGroup
                value={responses[currentQuestion.key] || ''}
                onValueChange={handleResponseChange}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={responses[currentQuestion.key]?.includes(option) || false}
                      onCheckedChange={(checked) => handleMultipleChange(option, checked as boolean)}
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
            >
              {loading ? 'Processing...' : currentStep === questions.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
