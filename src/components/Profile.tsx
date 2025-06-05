
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Heart, 
  Mail, 
  Phone,
  Calendar,
  Bell,
  Shield,
  LogOut,
  Edit,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonaAvatar from './PersonaAvatar';

const Profile = () => {
  const navigate = useNavigate();
  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [userInfo, setUserInfo] = useState({
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15'
  });

  const personas = {
    nuva: { name: 'Nuva', description: 'Gentle & Empathetic' },
    nova: { name: 'Nova', description: 'Confident & Direct' },
    sage: { name: 'Sage', description: 'Wise & Balanced' }
  };

  const currentPersona = personas[selectedPersona as keyof typeof personas];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would save to backend
  };

  const handleChangePersona = () => {
    navigate('/persona-selection');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-slate-50 to-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/user-center')}
            className="w-10 h-10 rounded-full bg-stone-100/80 backdrop-blur-sm hover:bg-stone-200/80 shadow-sm border-0"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Button>
          
          <h1 className="font-display text-2xl font-light text-stone-700">
            Profile
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="w-10 h-10 rounded-full bg-stone-100/80 backdrop-blur-sm hover:bg-stone-200/80 shadow-sm border-0"
          >
            <Edit className="w-5 h-5 text-stone-600" />
          </Button>
        </div>

        {/* Profile Basic Info */}
        <Card className="mb-6 bg-stone-50/50 border-stone-200/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col text-center">
              {isEditing ? (
                <div className="w-full space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm text-stone-600">Name</Label>
                    <Input
                      id="name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="mt-1 border-stone-200 bg-white/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm text-stone-600">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="mt-1 border-stone-200 bg-white/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm text-stone-600">Phone</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="mt-1 border-stone-200 bg-white/80"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveProfile}
                    className="w-full bg-stone-600 hover:bg-stone-700 text-white border-0"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="font-display text-2xl font-light text-stone-800 mb-3">
                    {userInfo.name}
                  </h2>
                  <p className="text-stone-600 mb-2">{userInfo.email}</p>
                  <p className="text-stone-600 mb-4">{userInfo.phone}</p>
                  <div className="inline-flex items-center space-x-2 bg-stone-100/60 rounded-full px-3 py-1">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <span className="text-sm text-stone-600">
                      Member since {new Date(userInfo.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current AI Companion */}
        <Card className="mb-6 bg-slate-50/50 border-slate-200/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-light text-slate-700 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-rose-400" />
              AI Companion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-medium text-slate-700">{currentPersona.name}</h3>
                  <p className="text-sm text-slate-500">{currentPersona.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangePersona}
                className="text-slate-600 border-slate-300 hover:bg-slate-100 bg-white/80"
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Options */}
        <Card className="mb-6 bg-gray-50/50 border-gray-200/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-light text-gray-700 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-500" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Notifications</span>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-white/80">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Privacy & Security</span>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-white/80">Manage</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Preferences</span>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-white/80">Edit</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="mb-6 bg-red-50/50 border-red-200/50 shadow-sm">
          <CardContent className="p-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-red-600 border-red-300 hover:bg-red-100 bg-white/80"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center">
          <p className="text-sm text-stone-400">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
