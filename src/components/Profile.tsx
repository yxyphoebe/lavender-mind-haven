
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/user-center')}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm hover:from-blue-100 hover:to-purple-100 shadow-lg border border-blue-100"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </Button>
          
          <h1 className="font-display text-3xl font-bold text-neutral-800">
            Profile
          </h1>
          
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* 1. Improve Your Experience */}
        <Card className="mb-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 zen-shadow">
          <CardContent className="p-4">
            <Button
              onClick={() => navigate('/improvement-feedback')}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Improve Your Experience</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* 2. Therapist */}
        <Card className="mb-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow">
          <CardContent className="p-4">
            <Button
              onClick={() => navigate('/therapist-management')}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Therapist</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* 3. Username/Nickname */}
        <Card className="mb-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 zen-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Edit className="w-5 h-5 text-amber-600" />
                <span className="text-slate-700 font-medium">Username / Nickname</span>
              </div>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="h-8 w-32 text-sm border-amber-200 rounded-lg focus:ring-amber-400 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSave();
                      if (e.key === 'Escape') handleNameCancel();
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleNameSave}
                    className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNameCancel}
                    className="h-8 px-3 border-amber-200 hover:bg-amber-50 text-amber-600 rounded-lg text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNameEdit}
                  className="h-9 px-4 border-amber-200 hover:bg-amber-50 text-amber-600 rounded-lg font-medium"
                >
                  {userInfo.name}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4. Notification Settings */}
        <Card className="mb-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 zen-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-purple-600" />
                <span className="text-slate-700 font-medium">Notifications</span>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* 5. Contact */}
        <Card className="mb-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 zen-shadow">
          <CardContent className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 border-blue-200 hover:bg-blue-50 bg-white rounded-xl font-medium text-blue-600 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Contact</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-blue-100 shadow-lg">
                <DropdownMenuItem onClick={handleEmailContact} className="cursor-pointer">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleScheduleCall} className="cursor-pointer">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule a call
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* 6. Privacy & Terms */}
        <Card className="mb-4 bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 zen-shadow">
          <CardContent className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 bg-white rounded-xl font-medium text-slate-600 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Privacy & Terms</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-100 shadow-lg">
                <DropdownMenuItem onClick={handlePrivacyPolicy} className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTermsOfService} className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* 7. Logout */}
        <Card className="mb-6 bg-gradient-to-br from-rose-50 to-red-50 border border-red-200 zen-shadow">
          <CardContent className="p-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 bg-white rounded-xl font-medium transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center">
          <p className="text-sm text-slate-500 font-light">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
