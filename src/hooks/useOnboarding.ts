import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type OnboardingQuestionRow = Tables<'onboarding_questions'>;
type OnboardingOptionRow = Tables<'onboarding_options'>;

interface OnboardingQuestion extends OnboardingQuestionRow {
  options: OnboardingOption[];
}

interface OnboardingOption extends Omit<OnboardingOptionRow, 'matching_roles'> {
  matching_roles: string[];
}

export const useOnboardingQuestions = () => {
  return useQuery({
    queryKey: ['onboarding-questions'],
    queryFn: async (): Promise<OnboardingQuestion[]> => {
      // Get questions
      const { data: questions, error: questionsError } = await supabase
        .from('onboarding_questions')
        .select('*')
        .order('question_order');

      if (questionsError) {
        console.error('Error fetching onboarding questions:', questionsError);
        throw questionsError;
      }

      // Get options
      const { data: options, error: optionsError } = await supabase
        .from('onboarding_options')
        .select('*')
        .order('option_order');

      if (optionsError) {
        console.error('Error fetching onboarding options:', optionsError);
        throw optionsError;
      }

      // Group options by question
      const questionsWithOptions: OnboardingQuestion[] = questions.map(question => ({
        ...question,
        options: options
          .filter(option => option.question_id === question.id)
          .map(option => ({
            ...option,
            matching_roles: Array.isArray(option.matching_roles) 
              ? option.matching_roles as string[]
              : []
          }))
      }));

      return questionsWithOptions;
    },
  });
};