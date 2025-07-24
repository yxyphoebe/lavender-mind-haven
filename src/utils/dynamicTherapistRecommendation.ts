import { supabase } from '@/integrations/supabase/client';

export interface TherapistRecommendation {
  name: string;
  score: number;
  rank: number;
}

interface TherapistScores {
  [therapistName: string]: number;
}

export const calculateTherapistRecommendationsFromDB = async (
  answers: Record<number, string[]>
): Promise<TherapistRecommendation[]> => {
  try {
    // Get all questions and options from database
    const { data: questions, error: questionsError } = await supabase
      .from('onboarding_questions')
      .select('id, question_order')
      .order('question_order');

    if (questionsError) {
      throw questionsError;
    }

    const { data: options, error: optionsError } = await supabase
      .from('onboarding_options')
      .select('*');

    if (optionsError) {
      throw optionsError;
    }

    // Initialize therapist scores
    const therapistScores: TherapistScores = {};

    // Calculate scores based on answers
    Object.entries(answers).forEach(([questionIndex, selectedOptions]) => {
      const questionOrder = parseInt(questionIndex);
      const question = questions.find(q => q.question_order === questionOrder + 1);
      
      if (!question) return;

      selectedOptions.forEach(selectedOptionValue => {
        // Find the option that matches the selected value
        const option = options.find(opt => 
          opt.question_id === question.id && 
          opt.option_value === selectedOptionValue
        );

        if (option && Array.isArray(option.matching_roles)) {
          // Add points to matching therapists
          option.matching_roles.forEach((therapistName: string) => {
            if (!therapistScores[therapistName]) {
              therapistScores[therapistName] = 0;
            }
            therapistScores[therapistName] += 1;
          });
        }
      });
    });

    // Convert to array and sort by score
    const recommendations = Object.entries(therapistScores)
      .map(([name, score]) => ({ name, score, rank: 0 }))
      .sort((a, b) => b.score - a.score);

    // Assign ranks
    recommendations.forEach((rec, index) => {
      rec.rank = index + 1;
    });

    // Return top 3 recommendations
    return recommendations.slice(0, 3);
  } catch (error) {
    console.error('Error calculating therapist recommendations:', error);
    // Fallback to empty array if database query fails
    return [];
  }
};