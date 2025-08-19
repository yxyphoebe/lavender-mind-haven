import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useSmartRedirect = () => {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const checkAndRedirect = async () => {
    if (!initialized) return;
    
    // If not authenticated, go to auth page
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsChecking(true);
    
    try {
      // Get user profile data
      const { data: profile, error } = await supabase
        .from('users')
        .select('onboarding_completed, selected_therapist_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to onboarding if we can't get profile data
        navigate('/onboarding');
        return;
      }

      // Determine where to redirect based on user state
      if (!profile.onboarding_completed || !profile.selected_therapist_id) {
        navigate('/onboarding');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error in smart redirect:', error);
      navigate('/onboarding'); // Safe fallback
    } finally {
      setIsChecking(false);
    }
  };

  return { checkAndRedirect, isChecking };
};