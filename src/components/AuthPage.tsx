
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Flower2, Mail, Phone, Eye, EyeOff, Settings, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authEnabled, setAuthEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  
  // Form errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const navigate = useNavigate();
  const { signUp, signIn, resetPassword, signInWithOAuth, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user && authEnabled) {
      navigate('/onboarding');
    }
  }, [user, authEnabled, navigate]);

  // Form validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return '请输入邮箱地址';
    if (!emailRegex.test(email)) return '邮箱格式不正确';
    return '';
  };

  const validatePassword = (password: string, isSignup = false) => {
    if (!password) return '请输入密码';
    if (isSignup && password.length < 6) return '密码至少需要6位字符';
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '请确认密码';
    if (password !== confirmPassword) return '两次输入的密码不一致';
    return '';
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    if (!authEnabled) {
      // Skip authentication for testing
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/onboarding');
      }, 800);
      return;
    }

    // Validate form
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password, type === 'signup');
    let confirmPasswordErr = '';
    
    if (type === 'signup') {
      confirmPasswordErr = validateConfirmPassword(password, confirmPassword);
    }

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    if (emailErr || passwordErr || confirmPasswordErr) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (type === 'signup') {
        result = await signUp(email, password, name);
      } else {
        result = await signIn(email, password);
      }

      if (!result.error) {
        if (type === 'login') {
          navigate('/onboarding');
        } else {
          // For signup, stay on auth page to show verification message
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    if (!authEnabled) {
      // Skip authentication for testing
      setTimeout(() => navigate('/onboarding'), 500);
      return;
    }

    try {
      const { error } = await signInWithOAuth(provider);
      if (!error) {
        // OAuth will redirect automatically
      }
    } catch (error) {
      console.error('Social auth error:', error);
    }
  };

  const handleForgotPassword = async () => {
    const emailErr = validateEmail(resetEmail);
    if (emailErr) {
      toast({
        title: "邮箱错误",
        description: emailErr,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await resetPassword(resetEmail);
      if (!error) {
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  // Clear errors on input change
  useEffect(() => {
    if (emailError && email) setEmailError('');
  }, [email, emailError]);

  useEffect(() => {
    if (passwordError && password) setPasswordError('');
  }, [password, passwordError]);

  useEffect(() => {
    if (confirmPasswordError && confirmPassword) setConfirmPasswordError('');
  }, [confirmPassword, confirmPasswordError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md animate-slide-up">
        {/* Dev Switch */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">认证模式</span>
          <Switch 
            checked={authEnabled} 
            onCheckedChange={setAuthEnabled}
            className="data-[state=checked]:bg-primary"
          />
          <span className="text-sm font-medium text-foreground">
            {authEnabled ? '真实' : '测试'}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center zen-shadow">
              <Flower2 className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome to Mindful AI
          </h1>
          <p className="text-muted-foreground font-light">
            Your journey to wellness begins here
          </p>
          {!authEnabled && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              测试模式 - 无需认证
            </div>
          )}
        </div>

        {/* Auth Card */}
        <Card className="bg-white/90 backdrop-blur-sm border border-border zen-shadow">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted rounded-xl">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary">
                  登录
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary">
                  注册
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <CardTitle className="text-center text-foreground mb-6">欢迎回来</CardTitle>
                <CardContent className="space-y-4 p-0">
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="邮箱地址"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 h-12 border-border rounded-xl focus:ring-primary bg-background ${emailError ? 'border-destructive' : ''}`}
                        disabled={isSubmitting}
                      />
                      {emailError && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive">{emailError}</span>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pr-10 h-12 border-border rounded-xl focus:ring-primary bg-background ${passwordError ? 'border-destructive' : ''}`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {passwordError && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive">{passwordError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                      <DialogTrigger asChild>
                        <button className="text-sm text-primary hover:underline">
                          忘记密码？
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>重置密码</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            type="email"
                            placeholder="请输入您的邮箱地址"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                          <Button onClick={handleForgotPassword} className="w-full">
                            发送重置邮件
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Button 
                    onClick={() => handleAuth('login')}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-300 mobile-button"
                    disabled={isSubmitting || authLoading}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        登录中...
                      </>
                    ) : (
                      '登录'
                    )}
                  </Button>
                </CardContent>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <CardTitle className="text-center text-foreground mb-6">创建账户</CardTitle>
                <CardContent className="space-y-4 p-0">
                  <div className="space-y-4">
                    <Input 
                      type="text" 
                      placeholder="姓名（可选）"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 border-border rounded-xl focus:ring-primary bg-background"
                      disabled={isSubmitting}
                    />
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="邮箱地址"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 h-12 border-border rounded-xl focus:ring-primary bg-background ${emailError ? 'border-destructive' : ''}`}
                        disabled={isSubmitting}
                      />
                      {emailError && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive">{emailError}</span>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="设置密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pr-10 h-12 border-border rounded-xl focus:ring-primary bg-background ${passwordError ? 'border-destructive' : ''}`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {passwordError && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive">{passwordError}</span>
                        </div>
                      )}
                    </div>
                    {authEnabled && password && (
                      <PasswordStrengthIndicator password={password} />
                    )}
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="确认密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pr-10 h-12 border-border rounded-xl focus:ring-primary bg-background ${confirmPasswordError ? 'border-destructive' : ''}`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {confirmPasswordError && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive">{confirmPasswordError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleAuth('signup')}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-300 mobile-button"
                    disabled={isSubmitting || authLoading}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        注册中...
                      </>
                    ) : (
                      '创建账户'
                    )}
                  </Button>
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Social Auth */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="h-px bg-border flex-1"></div>
            <span>或使用其他方式{activeTab === 'login' ? '登录' : '注册'}</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialAuth('google')}
              className="h-12 border-border hover:bg-accent rounded-xl bg-background mobile-button"
              disabled={isSubmitting}
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
              className="h-12 border-border hover:bg-accent rounded-xl bg-background mobile-button"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => handleSocialAuth('google')} // Phone auth would need additional setup
            className="w-full h-12 border-border hover:bg-accent rounded-xl bg-background mobile-button"
            disabled={isSubmitting}
          >
            <Phone className="w-5 h-5 mr-2" />
            手机号{activeTab === 'login' ? '登录' : '注册'}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6 leading-relaxed">
          继续使用即表示您同意我们的{' '}
          <a href="#" className="text-primary hover:underline">服务条款</a>
          {' '}和{' '}
          <a href="#" className="text-primary hover:underline">隐私政策</a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
