import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Phone,
  Calendar,
  
  Shield,
  LogOut,
  Edit,
  ArrowLeft,
  ChevronDown,
  FileText,
  ExternalLink,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackNavigation } from '@/hooks/useUserCenterMessage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditingName, setIsEditingName] = useState(false);
  
  const [tempName, setTempName] = useState('');
  
  // User data state
  const [userInfo, setUserInfo] = useState({
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15'
  });

  const handleNameEdit = () => {
    setTempName(userInfo.name);
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (tempName.trim()) {
      setUserInfo({ ...userInfo, name: tempName.trim() });
      setIsEditingName(false);
      
      // TODO: Save to Supabase
      toast({
        title: "Name updated",
        description: "Your name has been successfully updated.",
      });
    }
  };

  const handleNameCancel = () => {
    setTempName('');
    setIsEditingName(false);
  };


  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const handleEmailContact = () => {
    window.location.href = 'mailto:support@yourapp.com';
  };

  const handleScheduleCall = () => {
    window.open('https://calendly.com/your-team/consultation', '_blank');
  };

  const handlePrivacyPolicy = () => {
    window.open('/privacy-policy', '_blank');
  };

  const handleTermsOfService = () => {
    window.open('/terms-of-service', '_blank');
  };

  // Track navigation for smart message system
  useEffect(() => {
    trackNavigation('/profile');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--zen-base))' }}>
      <div className="container mx-auto px-6 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="w-12 h-12 rounded-xl zen-soft-glass border-0 zen-gentle-shadow"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(var(--zen-text))' }} />
          </Button>
          
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'hsl(var(--zen-text))' }}>
            Profile
          </h1>
          
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* 1. Improve Your Experience */}
        <div className="mb-4 zen-warm-glass rounded-xl p-4 zen-gentle-shadow">
          <Button
            onClick={() => navigate('/feedback')}
            variant="ghost"
            className="w-full h-12 font-light rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.01]"
            style={{ 
              color: 'hsl(var(--zen-text))',
              background: 'transparent'
            }}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Improve Your Experience</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* 2. Therapist */}
        <div className="mb-4 zen-warm-glass rounded-xl p-4 zen-gentle-shadow">
          <Button
            onClick={() => navigate('/therapist')}
            variant="ghost"
            className="w-full h-12 font-light rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.01]"
            style={{ 
              color: 'hsl(var(--zen-text))',
              background: 'transparent'
            }}
          >
            <Users className="w-5 h-5" />
            <span>Therapist</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* 3. Settings - Combined Card */}
        <div className="mb-4 zen-soft-glass rounded-xl zen-gentle-shadow">
          <div className="p-4 space-y-4">
            {/* Username */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Edit className="w-5 h-5" style={{ color: 'hsl(var(--zen-text))' }} />
                <span className="font-light" style={{ color: 'hsl(var(--zen-text))' }}>Username</span>
              </div>
              {isEditingName ? (
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="h-8 w-32 text-sm border-0 zen-gentle-shadow rounded-lg font-light"
                  style={{ 
                    background: 'hsl(var(--zen-gentle))',
                    color: 'hsl(var(--zen-text))'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') handleNameCancel();
                  }}
                  onBlur={handleNameSave}
                  autoFocus
                />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNameEdit}
                  className="h-9 px-4 border-0 zen-gentle-shadow rounded-lg font-light hover:bg-white/50"
                  style={{ 
                    background: 'hsl(var(--zen-gentle))',
                    color: 'hsl(var(--zen-text))'
                  }}
                >
                  {userInfo.name}
                </Button>
              )}
            </div>

            <div className="h-px" style={{ background: 'hsl(var(--zen-gentle))' }} />

            {/* Contact */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-between font-light hover:bg-white/50"
                  style={{ color: 'hsl(var(--zen-text))' }}
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5" />
                    <span>Contact</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 zen-soft-glass border-0">
                <DropdownMenuItem onClick={handleEmailContact} className="cursor-pointer hover:bg-white/50" style={{ color: 'hsl(var(--zen-text))' }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleScheduleCall} className="cursor-pointer hover:bg-white/50" style={{ color: 'hsl(var(--zen-text))' }}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule a call
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-px" style={{ background: 'hsl(var(--zen-gentle))' }} />

            {/* Privacy & Terms */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-between font-light hover:bg-white/50"
                  style={{ color: 'hsl(var(--zen-text))' }}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <span>Privacy & Terms</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 zen-soft-glass border-0">
                <DropdownMenuItem onClick={handlePrivacyPolicy} className="cursor-pointer hover:bg-white/50" style={{ color: 'hsl(var(--zen-text))' }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTermsOfService} className="cursor-pointer hover:bg-white/50" style={{ color: 'hsl(var(--zen-text))' }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 4. Logout */}
        <div className="mb-8 zen-soft-glass rounded-xl p-4 zen-gentle-shadow">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full h-12 font-light transition-all duration-300 hover:bg-white/50"
            style={{ color: 'hsl(var(--zen-text))' }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center">
          <p className="text-sm font-light" style={{ color: 'hsl(var(--zen-text) / 0.6)' }}>
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;