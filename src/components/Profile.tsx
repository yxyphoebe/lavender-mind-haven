import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  ExternalLink,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackNavigation } from '@/hooks/useUserCenterMessage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [tempName, setTempName] = useState('');
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // User data state
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: ''
  });

  const handleNameEdit = () => {
    setTempName(userInfo.name);
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (!user || !tempName.trim()) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ name: tempName.trim() })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating name:', error);
        toast({
          title: "Error",
          description: "Failed to update name",
          variant: "destructive"
        });
        return;
      }

      setUserInfo({ ...userInfo, name: tempName.trim() });
      setIsEditingName(false);
      toast({
        title: "Success",
        description: "Name updated successfully"
      });
    } catch (error) {
      console.error('Error updating name:', error);
      toast({
        title: "Error",
        description: "Failed to update name",
        variant: "destructive"
      });
    }
  };

  const handleNameCancel = () => {
    setTempName('');
    setIsEditingName(false);
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ notifications_enabled: enabled })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating notifications:', error);
        toast({
          title: "Error",
          description: "Failed to update notification settings",
          variant: "destructive"
        });
        return;
      }

      setNotificationsEnabled(enabled);
      toast({
        title: "Success",
        description: "Notification settings updated"
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    }
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

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('name, email, phone, notifications_enabled, created_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive"
          });
          return;
        }

        if (data) {
          setUserInfo({
            name: data.name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            joinDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : ''
          });
          setNotificationsEnabled(data.notifications_enabled ?? true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    trackNavigation('/profile');
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-xl bg-white shadow-sm border-0 hover:bg-purple-50 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* 1. Improve Your Experience */}
        <div className="mb-4 bg-gradient-to-br from-purple-200 to-purple-300 rounded-3xl p-5 shadow-none">
          <Button
            onClick={() => navigate('/feedback')}
            variant="ghost"
            className="w-full h-14 font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-purple-400/30 text-purple-900 bg-transparent border-0"
          >
            <TrendingUp className="w-5 h-5 text-purple-800" />
            <span>Help Us Grow</span>
            <ExternalLink className="w-4 h-4 text-purple-700" />
          </Button>
        </div>

        {/* 2. Therapist */}
        <div className="mb-4 bg-gradient-to-br from-purple-200 to-purple-300 rounded-3xl p-5 shadow-none">
          <Button
            onClick={() => navigate('/therapist')}
            variant="ghost"
            className="w-full h-14 font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-purple-400/30 text-purple-900 bg-transparent border-0"
          >
            <Users className="w-5 h-5 text-purple-800" />
            <span>Meet a New Energy</span>
            <ExternalLink className="w-4 h-4 text-purple-700" />
          </Button>
        </div>

        {/* 3. Settings - Combined Card */}
        <div className="mb-4 bg-white rounded-2xl shadow-sm">
          <div className="p-5 space-y-4">
            {/* Username */}
            <Button
              variant="ghost"
              onClick={handleNameEdit}
              className="w-full h-12 justify-between font-medium hover:bg-purple-50 text-gray-700 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <Edit className="w-5 h-5 text-purple-600" />
                <span>Username</span>
              </div>
              {isEditingName ? (
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="h-8 w-32 text-sm border border-gray-200 rounded-lg bg-gray-50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') handleNameCancel();
                  }}
                  onBlur={handleNameSave}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="text-gray-600">{userInfo.name}</span>
              )}
            </Button>

            <div className="h-px bg-gray-100" />

            {/* Notifications */}
            <div className="flex items-center justify-between h-12 px-3 rounded-xl hover:bg-purple-50">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">Notifications</span>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Contact */}
            <Collapsible open={isContactExpanded} onOpenChange={setIsContactExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-between font-medium hover:bg-purple-50 text-gray-700 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <span>Contact</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isContactExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden">
                <div className="pt-2 space-y-1">
                  <Button
                    variant="ghost"
                    onClick={handleEmailContact}
                    className="w-full h-10 justify-start font-medium hover:bg-purple-50 text-gray-600 rounded-lg"
                  >
                    <Mail className="w-4 h-4 mr-3 text-purple-500" />
                    Email
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleScheduleCall}
                    className="w-full h-10 justify-start font-medium hover:bg-purple-50 text-gray-600 rounded-lg"
                  >
                    <Calendar className="w-4 h-4 mr-3 text-purple-500" />
                    Schedule a call
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="h-px bg-gray-100" />

            {/* Privacy & Terms */}
            <Collapsible open={isPrivacyExpanded} onOpenChange={setIsPrivacyExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-between font-medium hover:bg-purple-50 text-gray-700 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span>Privacy & Terms</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isPrivacyExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden">
                <div className="pt-2 space-y-1">
                  <Button
                    variant="ghost"
                    onClick={handlePrivacyPolicy}
                    className="w-full h-10 justify-start font-medium hover:bg-purple-50 text-gray-600 rounded-lg"
                  >
                    <FileText className="w-4 h-4 mr-3 text-purple-500" />
                    Privacy Policy
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleTermsOfService}
                    className="w-full h-10 justify-start font-medium hover:bg-purple-50 text-gray-600 rounded-lg"
                  >
                    <FileText className="w-4 h-4 mr-3 text-purple-500" />
                    Terms of Service
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* 4. Logout */}
        <div className="mb-8 bg-white rounded-2xl p-5 shadow-sm">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full h-12 font-medium transition-all duration-300 hover:bg-red-50 text-red-600 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;