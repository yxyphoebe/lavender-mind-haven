import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isLovableTestEnvironment, getMockTestUser, getMockTestSession } from '@/utils/environment';

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

    // In Lovable test environment, use mock test user
    if (isLovableTestEnvironment()) {
      if (mounted) {
        const mockUser = getMockTestUser() as any;
        const mockSession = getMockTestSession() as any;
        
        setState({
          user: mockUser,
          session: mockSession,
          loading: false,
          initialized: true,
        });
      }
      return () => { mounted = false; };
    }

    // Production environment - use real Supabase auth
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
    // In test environment, automatically use test user
    if (isLovableTestEnvironment()) {
      const mockUser = getMockTestUser() as any;
      const mockSession = getMockTestSession() as any;
      
      setState({
        user: mockUser,
        session: mockSession,
        loading: false,
        initialized: true,
      });
      
      toast({
        title: "测试环境",
        description: "自动登录成功",
      });
      return { error: null };
    }

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
    // In test environment, automatically use test user
    if (isLovableTestEnvironment()) {
      const mockUser = getMockTestUser() as any;
      const mockSession = getMockTestSession() as any;
      
      setState({
        user: mockUser,
        session: mockSession,
        loading: false,
        initialized: true,
      });
      
      toast({
        title: "测试环境",
        description: "自动登录成功",
      });
      return { error: null };
    }

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
    // In test environment, just clear state
    if (isLovableTestEnvironment()) {
      setState({
        user: null,
        session: null,
        loading: false,
        initialized: true,
      });
      
      toast({
        title: "测试环境",
        description: "已退出登录",
      });
      return { error: null };
    }

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
    // In test environment, just show success message
    if (isLovableTestEnvironment()) {
      toast({
        title: "测试环境",
        description: "密码重置邮件已发送（模拟）",
      });
      return { error: null };
    }

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
    // In test environment, automatically use test user
    if (isLovableTestEnvironment()) {
      const mockUser = getMockTestUser() as any;
      const mockSession = getMockTestSession() as any;
      
      setState({
        user: mockUser,
        session: mockSession,
        loading: false,
        initialized: true,
      });
      
      toast({
        title: "测试环境",
        description: `已模拟 ${provider} 登录`,
      });
      return { error: null };
    }

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

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInWithOAuth,
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