import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWelcomePrompt = (therapistId: string) => {
  const { data: welcomePrompt = '', isLoading } = useQuery({
    queryKey: ['welcomePrompt', therapistId],
    queryFn: async (): Promise<string> => {
      if (!therapistId) {
        return '';
      }

      const { data, error } = await supabase
        .from('generation_prompts')
        .select('prompt_text')
        .eq('therapist_id', therapistId)
        .eq('prompt_type', 'welcome')
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching welcome prompt:', error);
        return '';
      }

      return data?.prompt_text || '';
    },
    enabled: !!therapistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return { welcomePrompt, isLoading };
};