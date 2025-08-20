import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TherapistContextType {
  selectedTherapistId: string;
  isLoading: boolean;
  updateSelectedTherapist: (therapistId: string, showToast?: boolean) => Promise<boolean>;
  refreshSelectedTherapist: () => Promise<void>;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const useTherapistContext = () => {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error('useTherapistContext must be used within a TherapistProvider');
  }
  return context;
};

interface TherapistProviderProps {
  children: ReactNode;
}

export const TherapistProvider: React.FC<TherapistProviderProps> = ({ children }) => {
  const { user, initialized } = useAuth();
  const { toast } = useToast();
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const updateSelectedTherapist = async (therapistId: string, showToast = true): Promise<boolean> => {
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

      // Update local state and localStorage immediately
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
  };

  const refreshSelectedTherapist = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('selected_therapist_id')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const dbTherapistId = data.selected_therapist_id || '';
        setSelectedTherapistId(dbTherapistId);
        localStorage.setItem('selectedTherapistId', dbTherapistId);
      }
    } catch (error) {
      console.error('Error refreshing selected therapist:', error);
    }
  };

  // Load selected therapist from database on mount
  useEffect(() => {
    const loadSelectedTherapist = async () => {
      if (!initialized || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Always fetch from database first
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
        } else {
          const dbTherapistId = data?.selected_therapist_id || '';
          setSelectedTherapistId(dbTherapistId);
          // Sync localStorage with database
          localStorage.setItem('selectedTherapistId', dbTherapistId);
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
  }, [user, initialized]);

  const value: TherapistContextType = {
    selectedTherapistId,
    isLoading,
    updateSelectedTherapist,
    refreshSelectedTherapist,
  };

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  );
};