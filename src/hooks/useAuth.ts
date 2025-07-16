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
          toast({
            title: "欢迎回来！",
            description: "您已成功登录",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "已退出登录",
            description: "期待您的再次使用",
          });
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
          data: name ? { full_name: name } : undefined,
        },
      });

      if (error) {
        toast({
          title: "注册失败",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "注册成功！",
          description: "请检查您的邮箱以验证账户",
        });
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "注册失败",
        description: "网络错误，请稍后重试",
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
          title: "登录失败",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "登录失败",
        description: "网络错误，请稍后重试",
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
        title: "退出失败",
        description: "网络错误，请稍后重试",
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
          title: "重置失败",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "重置邮件已发送",
          description: "请检查您的邮箱以重置密码",
        });
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "重置失败",
        description: "网络错误，请稍后重试",
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
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "社交登录失败",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      }

      return { error };
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: "社交登录失败",
        description: "网络错误，请稍后重试",
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
      return '邮箱或密码错误';
    case 'Email not confirmed':
      return '请先验证您的邮箱';
    case 'User already registered':
      return '该邮箱已注册，请直接登录';
    case 'Password should be at least 6 characters':
      return '密码至少需要6位字符';
    case 'Invalid email':
      return '邮箱格式不正确';
    case 'Email rate limit exceeded':
      return '邮件发送过于频繁，请稍后重试';
    default:
      return error.message || '未知错误';
  }
}