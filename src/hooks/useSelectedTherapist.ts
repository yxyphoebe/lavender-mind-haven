import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useSelectedTherapist = () => {
  const { user, initialized } = useAuth();
  const { toast } = useToast();
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const updateSelectedTherapist = useCallback(async (therapistId: string, showToast = true) => {
    if (!user) {
      console.error('No user found when updating selected therapist');
      return false;
    }

    try {
      // Update database
      const { error } = await supabase
        .from('users')
        .update({ selected_therapist_id: therapistId })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating selected therapist in database:', error);
        if (showToast) {
          toast({
            title: "Error",
            description: "Failed to save therapist selection",
            variant: "destructive"
          });
        }
        return false;
      }

      // Update local state and localStorage
      setSelectedTherapistId(therapistId);
      localStorage.setItem('selectedTherapistId', therapistId);

      if (showToast) {
        toast({
          title: "Success",
          description: "Therapist selection saved"
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating selected therapist:', error);
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to save therapist selection",
          variant: "destructive"
        });
      }
      return false;
    }
  }, [user, toast]);

  // Load selected therapist from database on mount
  useEffect(() => {
    const loadSelectedTherapist = async () => {
      if (!initialized || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // First try to get from database
        const { data, error } = await supabase
          .from('users')
          .select('selected_therapist_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading selected therapist from database:', error);
          // Fallback to localStorage
          const localStorageId = localStorage.getItem('selectedTherapistId') || '';
          setSelectedTherapistId(localStorageId);
          setIsLoading(false);
          return;
        }

        const dbTherapistId = data?.selected_therapist_id || '';
        const localStorageId = localStorage.getItem('selectedTherapistId') || '';

        if (dbTherapistId) {
          // Use database value and sync localStorage
          setSelectedTherapistId(dbTherapistId);
          if (localStorageId !== dbTherapistId) {
            localStorage.setItem('selectedTherapistId', dbTherapistId);
          }
        } else if (localStorageId) {
          // Database is empty but localStorage has value, update database
          setSelectedTherapistId(localStorageId);
          await updateSelectedTherapist(localStorageId, false);
        } else {
          setSelectedTherapistId('');
        }
      } catch (error) {
        console.error('Error loading selected therapist:', error);
        // Fallback to localStorage
        const localStorageId = localStorage.getItem('selectedTherapistId') || '';
        setSelectedTherapistId(localStorageId);
      } finally {
        setIsLoading(false);
      }
    };

    loadSelectedTherapist();
  }, [user, initialized, updateSelectedTherapist]);
  return {
    selectedTherapistId,
    updateSelectedTherapist,
    isLoading
  };
};