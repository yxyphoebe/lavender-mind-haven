
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flower2, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'signup') => {
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding');
    }, 1500);
  };

  const handleSocialAuth = (provider: string) => {
    console.log(`Authenticating with ${provider}`);
    // In a real app, this would integrate with actual social auth
    setTimeout(() => navigate('/onboarding'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-rose-400 rounded-2xl flex items-center justify-center mindful-shadow">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            Welcome to Mindful AI
          </h1>
          <p className="text-sage-600 font-light">
            Your journey to wellness begins here
          </p>
        </div>

        {/* Auth Card */}
        <Card className="glass-effect border-0 mindful-shadow">
          <CardHeader>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-sky-50 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-sky-700">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-sky-700">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <CardTitle className="text-center text-sage-800 mb-6">Welcome back</CardTitle>
                <CardContent className="space-y-4 p-0">
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-sage-400" />
                      <Input 
                        type="email" 
                        placeholder="Email address"
                        className="pl-10 h-12 border-sky-200 rounded-xl focus:ring-sky-400"
                      />
                    </div>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pr-10 h-12 border-sky-200 rounded-xl focus:ring-sky-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-sage-400 hover:text-sage-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleAuth('login')}
                    className="w-full h-12 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl font-medium transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </CardContent>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <CardTitle className="text-center text-sage-800 mb-6">Create account</CardTitle>
                <CardContent className="space-y-4 p-0">
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-sage-400" />
                      <Input 
                        type="email" 
                        placeholder="Email address"
                        className="pl-10 h-12 border-sky-200 rounded-xl focus:ring-sky-400"
                      />
                    </div>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="pr-10 h-12 border-sky-200 rounded-xl focus:ring-sky-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-sage-400 hover:text-sage-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input 
                        type="password"
                        placeholder="Confirm password"
                        className="h-12 border-sky-200 rounded-xl focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleAuth('signup')}
                    className="w-full h-12 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl font-medium transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Social Auth */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center space-x-4 text-sm text-sage-500">
            <div className="h-px bg-sky-200 flex-1"></div>
            <span>or continue with</span>
            <div className="h-px bg-sky-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialAuth('google')}
              className="h-12 border-sky-200 hover:bg-sky-50 rounded-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialAuth('apple')}
              className="h-12 border-sky-200 hover:bg-sky-50 rounded-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => handleSocialAuth('phone')}
            className="w-full h-12 border-sky-200 hover:bg-sky-50 rounded-xl"
          >
            <Phone className="w-5 h-5 mr-2" />
            Continue with Phone
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-sage-500 mt-6 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="text-sky-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-sky-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
