
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type OnboardingResponse = Tables<'onboarding_responses'>;

export interface OnboardingQuestion {
  key: string;
  text: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: string[];
  weight?: number;
}

export const useOnboarding = () => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const questions: OnboardingQuestion[] = [
    {
      key: 'preferred_communication_style',
      text: 'How do you prefer to communicate about your feelings?',
      type: 'single',
      options: ['Direct and straightforward', 'Gentle and supportive', 'Analytical and structured', 'Creative and expressive'],
      weight: 3
    },
    {
      key: 'primary_concerns',
      text: 'What are your primary areas of concern? (Select all that apply)',
      type: 'multiple',
      options: ['Anxiety', 'Depression', 'Relationships', 'Work stress', 'Self-esteem', 'Life transitions'],
      weight: 5
    },
    {
      key: 'therapy_experience',
      text: 'Have you tried therapy before?',
      type: 'single',
      options: ['Never', 'Once or twice', 'Several times', 'Regularly'],
      weight: 2
    },
    {
      key: 'support_preference',
      text: 'What type of support resonates most with you?',
      type: 'single',
      options: ['Maternal/nurturing', 'Peer/friend-like', 'Professional/clinical', 'Spiritual/mindful'],
      weight: 4
    },
    {
      key: 'age_preference',
      text: 'Do you have a preference for your therapist\'s age range?',
      type: 'single',
      options: ['Younger (20s)', 'Peer (30s)', 'Experienced (40s+)', 'No preference'],
      weight: 2
    },
    {
      key: 'session_frequency',
      text: 'How often would you like to have sessions?',
      type: 'single',
      options: ['Daily', 'Few times a week', 'Weekly', 'As needed'],
      weight: 1
    }
  ];

  const saveResponse = (questionKey: string, answer: string) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: answer
    }));
  };

  const submitOnboarding = async (userId: string) => {
    try {
      setLoading(true);

      // Save all responses to database
      const onboardingData = questions.map(question => ({
        user_id: userId,
        question_key: question.key,
        question_text: question.text,
        answer_value: responses[question.key] || '',
        answer_weight: question.weight || 1
      }));

      const { error } = await supabase
        .from('onboarding_responses')
        .insert(onboardingData);

      if (error) throw error;

      // Generate therapist recommendations based on responses
      await generateTherapistRecommendations(userId);

      return true;
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateTherapistRecommendations = async (userId: string) => {
    try {
      // Get all therapists
      const { data: therapists } = await supabase
        .from('therapists')
        .select('*');

      if (!therapists) return;

      // Simple recommendation algorithm based on responses
      const recommendations = therapists.map(therapist => {
        let score = 0.5; // Base score

        // Adjust score based on user responses
        const communicationStyle = responses.preferred_communication_style;
        const supportPreference = responses.support_preference;
        const agePreference = responses.age_preference;

        // Match communication style with therapist style
        if (communicationStyle === 'Gentle and supportive' && therapist.name === 'Sage') score += 0.3;
        if (communicationStyle === 'Creative and expressive' && therapist.name === 'Lani') score += 0.3;
        if (communicationStyle === 'Analytical and structured' && therapist.name === 'Jade') score += 0.3;
        if (communicationStyle === 'Direct and straightforward' && therapist.name === 'Elena') score += 0.3;

        // Match support preference
        if (supportPreference === 'Maternal/nurturing' && therapist.name === 'Elena') score += 0.2;
        if (supportPreference === 'Peer/friend-like' && therapist.name === 'Lani') score += 0.2;
        if (supportPreference === 'Spiritual/mindful' && therapist.name === 'Sage') score += 0.2;
        if (supportPreference === 'Professional/clinical' && therapist.name === 'Jade') score += 0.2;

        // Match age preference
        if (agePreference === 'Younger (20s)' && therapist.age_range === '20') score += 0.1;
        if (agePreference === 'Peer (30s)' && therapist.age_range === '30') score += 0.1;
        if (agePreference === 'Experienced (40s+)' && (therapist.age_range === '45' || therapist.age_range === '60')) score += 0.1;

        return {
          user_id: userId,
          therapist_id: therapist.id,
          recommendation_score: Math.min(score, 1),
          reasoning: {
            communication_match: communicationStyle,
            support_match: supportPreference,
            age_match: agePreference
          }
        };
      });

      // Save recommendations
      const { error } = await supabase
        .from('therapist_recommendations')
        .upsert(recommendations);

      if (error) throw error;
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  return {
    questions,
    responses,
    loading,
    saveResponse,
    submitOnboarding
  };
};
