import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Assistant = Tables<'assistants'>;

export const useAssistants = () => {
  return useQuery({
    queryKey: ['assistants'],
    queryFn: async (): Promise<Assistant[]> => {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching assistants:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAssistant = (id: string) => {
  return useQuery({
    queryKey: ['assistant', id],
    queryFn: async (): Promise<Assistant | null> => {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching assistant:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useFeedbackAssistant = () => {
  return useQuery({
    queryKey: ['assistants', 'feedback'],
    queryFn: async (): Promise<Assistant | null> => {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('role', 'feedback')
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching feedback assistant:', error);
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};