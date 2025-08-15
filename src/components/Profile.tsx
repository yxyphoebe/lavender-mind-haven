
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Phone,
  Calendar,
  Bell,
  Shield,
  LogOut,
  Edit,
  ArrowLeft,
  ChevronDown,
  FileText,
  ExternalLink
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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

  const handleNotificationToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    
    // TODO: Save to Supabase
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: `You will ${enabled ? 'receive' : 'not receive'} notifications.`,
    });
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
    <div className="min-h-screen zen-natural-texture">
      <div className="container mx-auto px-6 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/user-center')}
            className="w-12 h-12 rounded-xl zen-soft-glass border-0 zen-gentle-shadow"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(var(--zen-stone))' }} />
          </Button>
          
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'hsl(var(--zen-stone))' }}>
            Profile
          </h1>
          
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* 1. Improve Your Experience */}
        <Card className="mb-6 zen-soft-glass border-0 relative z-10">
          <CardContent className="p-5">
            <Button
              onClick={() => navigate('/improvement-feedback')}
              className="w-full h-12 border-0 zen-gentle-shadow font-light rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              style={{ 
                background: `linear-gradient(135deg, hsl(var(--zen-tea)), hsl(var(--zen-almond)))`,
                color: 'hsl(var(--zen-stone))'
              }}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Improve Your Experience</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* 2. Therapist */}
        <Card className="mb-6 zen-soft-glass border-0 relative z-10">
          <CardContent className="p-5">
            <Button
              onClick={() => navigate('/therapist-management')}
              className="w-full h-12 border-0 zen-gentle-shadow font-light rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              style={{ 
                background: `linear-gradient(135deg, hsl(var(--zen-fog-blue)), hsl(var(--zen-bamboo)))`,
                color: 'hsl(var(--zen-stone))'
              }}
            >
              <Users className="w-5 h-5" />
              <span>Therapist</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* 3. Username/Nickname */}
        <Card className="mb-6 zen-soft-glass border-0 relative z-10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Edit className="w-5 h-5" style={{ color: 'hsl(var(--zen-stone))' }} />
                <span className="text-stone-700 font-light">Username / Nickname</span>
              </div>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="h-8 w-32 text-sm border-0 zen-gentle-shadow rounded-lg font-light"
                    style={{ 
                      background: `hsl(var(--zen-mist))`,
                      color: 'hsl(var(--zen-stone))'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSave();
                      if (e.key === 'Escape') handleNameCancel();
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleNameSave}
                    className="h-8 px-3 border-0 zen-gentle-shadow rounded-lg text-xs font-light"
                    style={{ 
                      background: `hsl(var(--zen-bamboo))`,
                      color: 'hsl(var(--zen-stone))'
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNameCancel}
                    className="h-8 px-3 border-0 zen-gentle-shadow rounded-lg text-xs font-light"
                    style={{ 
                      background: `hsl(var(--zen-mist))`,
                      color: 'hsl(var(--zen-stone))'
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNameEdit}
                  className="h-9 px-4 border-0 zen-gentle-shadow rounded-lg font-light"
                  style={{ 
                    background: `hsl(var(--zen-mist))`,
                    color: 'hsl(var(--zen-stone))'
                  }}
                >
                  {userInfo.name}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4. Notification Settings */}
        <Card className="mb-6 zen-soft-glass border-0 relative z-10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" style={{ color: 'hsl(var(--zen-stone))' }} />
                <span className="text-stone-700 font-light">Notifications</span>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* 5. Contact */}
        <Card className="mb-6 zen-soft-glass border-0 relative z-10">
          <CardContent className="p-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 border-0 zen-gentle-shadow rounded-xl font-light flex items-center justify-between"
                  style={{ 
                    background: `linear-gradient(135deg, hsl(var(--zen-fog-blue)), hsl(var(--zen-mist)))`,
                    color: 'hsl(var(--zen-stone))'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Contact</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 zen-soft-glass border-0">
                <DropdownMenuItem onClick={handleEmailContact} className="cursor-pointer text-stone-700 hover:bg-white/50">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleScheduleCall} className="cursor-pointer text-stone-700 hover:bg-white/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule a call
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* 6. Privacy & Terms */}
        <Card className="mb-6 zen-soft-glass border-0 relative z-10">
          <CardContent className="p-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 border-0 zen-gentle-shadow rounded-xl font-light flex items-center justify-between"
                  style={{ 
                    background: `linear-gradient(135deg, hsl(var(--zen-bamboo)), hsl(var(--zen-tea)))`,
                    color: 'hsl(var(--zen-stone))'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Privacy & Terms</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 zen-soft-glass border-0">
                <DropdownMenuItem onClick={handlePrivacyPolicy} className="cursor-pointer text-stone-700 hover:bg-white/50">
                  <FileText className="w-4 h-4 mr-2" />
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTermsOfService} className="cursor-pointer text-stone-700 hover:bg-white/50">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* 7. Logout */}
        <Card className="mb-8 zen-soft-glass border-0 relative z-10">
          <CardContent className="p-5">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full h-12 border-0 zen-gentle-shadow rounded-xl font-light transition-all duration-300"
              style={{ 
                background: `linear-gradient(135deg, hsl(var(--zen-sand)), hsl(var(--zen-warm-gray)))`,
                color: 'hsl(var(--zen-stone))'
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center relative z-10">
          <p className="text-sm text-stone-400 font-light">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
