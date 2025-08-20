import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthMethods {
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<{ error: AuthError | null }>;
  signInAsTestUser: () => Promise<{ error: AuthError | null }>;
}

export function useAuth(): AuthState & AuthMethods {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          initialized: true,
        }));

        // Handle auth events
        if (event === 'SIGNED_IN') {
          const userName = session?.user?.user_metadata?.name
            || session?.user?.user_metadata?.full_name
            || session?.user?.email?.split('@')[0]
            || 'friend';
          // no toast on sign-in
        } else if (event === 'SIGNED_OUT') {
          // Silent sign out - no notification needed
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
      }
    );

    // THEN check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (mounted) {
          setState(prev => ({
            ...prev,
            session,
            user: session?.user ?? null,
            loading: false,
            initialized: true,
          }));
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            initialized: true,
          }));
        }
      }
    };

    getSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: name || 'User',
            name: name || 'User',
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        // Silent success - user will be redirected automatically
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "Sign up failed",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "Sign in failed",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "Sign out failed",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        // Silent success - user will receive email
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "Password reset failed",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
      return { error };
    }
  }, [toast]);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        toast({
          title: "Social sign-in failed",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "Social sign-in failed",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
      return { error };
    }
  }, [toast]);

  const signInAsTestUser = useCallback(async () => {
    try {
      // Create mock session for test user PY
      const mockUser = {
        id: '03ea3053-1b96-4239-afaf-40bb8188ebaa',
        email: 'yxyphoebe@gmail.com',
        email_confirmed_at: new Date().toISOString(),
        phone: '',
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: { provider: 'test', providers: ['test'] },
        user_metadata: { 
          name: 'PY', 
          full_name: 'PY Test User',
          email: 'yxyphoebe@gmail.com'
        },
        aud: 'authenticated',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: new Date().toISOString(),
        role: 'authenticated'
      } as User;

      const mockSession = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      // Update state directly with mock session
      setState(prev => ({
        ...prev,
        session: mockSession,
        user: mockUser,
        loading: false,
        initialized: true,
      }));

      toast({
        title: "Test Mode Activated",
        description: "Signed in as test user PY",
        variant: "default",
      });

      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "Test sign-in failed",
        description: "Could not activate test mode",
        variant: "destructive",
      });
      return { error };
    }
  }, [toast]);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,  
    signInWithOAuth,
    signInAsTestUser,
  };
}

function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Incorrect email or password.';
    case 'Email not confirmed':
      return 'Please verify your email before signing in.';
    case 'User already registered':
      return 'This email is already registered. Please sign in.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters.';
    case 'Invalid email':
      return 'Invalid email address.';
    case 'Email rate limit exceeded':
      return 'Too many requests. Please try again later.';
    default:
      return error.message || 'Unexpected error occurred.';
  }
}