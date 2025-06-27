
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type User = Tables<'users'>;

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setUser(null);
        return;
      }

      // Get user profile from our users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If user doesn't exist, create one
      if (!data) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            name: authUser.user_metadata?.name || 'User',
            email: authUser.email,
            onboarding_completed: false
          })
          .select()
          .single();

        if (createError) throw createError;
        setUser(newUser);
      } else {
        setUser(data);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      return data;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const completeOnboarding = async (therapistId: string) => {
    return updateUser({
      onboarding_completed: true,
      selected_therapist_id: therapistId
    });
  };

  return {
    user,
    loading,
    error,
    updateUser,
    completeOnboarding,
    refetch: fetchUser
  };
};
