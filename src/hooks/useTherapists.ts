
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Therapist = Tables<'therapists'>;

export const useTherapists = () => {
  return useQuery({
    queryKey: ['therapists'],
    queryFn: async (): Promise<Therapist[]> => {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching therapists:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useTherapist = (id: string) => {
  return useQuery({
    queryKey: ['therapist', id],
    queryFn: async (): Promise<Therapist | null> => {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching therapist:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};
