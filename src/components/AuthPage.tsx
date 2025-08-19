import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [authEnabled, setAuthEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { signInWithOAuth, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user && authEnabled) {
      navigate('/onboarding');
    }
  }, [user, authEnabled, navigate]);

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    if (!authEnabled) {
      // Skip authentication for testing
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/onboarding');
      }, 800);
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await signInWithOAuth(provider);
      if (!error) {
        // OAuth will redirect automatically
      }
    } catch (error) {
      console.error('Social auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-600 via-mindful-400 to-enso-400 flex flex-col relative">
      {/* Dev Switch - positioned at top right */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
        <Settings className="w-4 h-4 text-white/80" />
        <span className="text-sm text-white/80">Test</span>
        <Switch 
          checked={authEnabled} 
          onCheckedChange={setAuthEnabled}
          className="data-[state=checked]:bg-white/30"
        />
        <span className="text-sm font-medium text-white">
          {authEnabled ? 'Live' : 'Test'}
        </span>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-16">
          {/* Branding */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white mb-2">
              Mindful AI
            </h1>
            <p className="text-white/80 text-lg font-light">
              Your journey begins here
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 w-full max-w-sm mx-auto">
            {/* Apple Sign In */}
            <Button 
              onClick={() => handleSocialAuth('apple')}
              className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Continue with Apple</span>
              </div>
            </Button>

            {/* Google Sign In */}
            <Button 
              onClick={() => handleSocialAuth('google')}
              className="w-full h-14 bg-white/95 hover:bg-white text-mindful-700 rounded-2xl text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Links - Fixed at bottom */}
      <div className="text-center text-sm text-white/70 p-6">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-white underline hover:text-white/80">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-white underline hover:text-white/80">Privacy Policy</a>
      </div>
    </div>
  );
};

export default AuthPage;