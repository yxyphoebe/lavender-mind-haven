import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWelcomePrompt = (therapistId: string) => {
  const [welcomePrompt, setWelcomePrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWelcomePrompt = async () => {
      if (!therapistId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('generation_prompts')
          .select('prompt_text')
          .eq('therapist_id', therapistId)
          .eq('prompt_type', 'welcome')
          .eq('active', true)
          .single();

        if (error) {
          console.error('Error fetching welcome prompt:', error);
        } else if (data) {
          setWelcomePrompt(data.prompt_text);
        }
      } catch (error) {
        console.error('Failed to fetch welcome prompt:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWelcomePrompt();
  }, [therapistId]);

  return { welcomePrompt, isLoading };
};