
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/user-center')}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          
          <h1 className="font-display text-2xl font-bold gradient-text">
            Profile
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <Edit className="w-5 h-5 text-slate-600" />
          </Button>
        </div>

        {/* Profile Basic Info */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col text-center">
              {isEditing ? (
                <div className="w-full space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm text-slate-600">Name</Label>
                    <Input
                      id="name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm text-slate-600">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm text-slate-600">Phone</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-violet-500 to-blue-500 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-800 mb-3">
                    {userInfo.name}
                  </h2>
                  <p className="text-slate-600 mb-2">{userInfo.email}</p>
                  <p className="text-slate-600 mb-4">{userInfo.phone}</p>
                  <div className="inline-flex items-center space-x-2 bg-slate-50 rounded-full px-3 py-1">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">
                      Member since {new Date(userInfo.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current AI Companion */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg text-slate-800 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-rose-500" />
              AI Companion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <PersonaAvatar personaId={selectedPersona as 'nuva' | 'nova' | 'sage'} size="sm" />
                <div>
                  <h3 className="font-semibold text-slate-800">{currentPersona.name}</h3>
                  <p className="text-sm text-slate-600">{currentPersona.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangePersona}
                className="text-violet-600 border-violet-200 hover:bg-violet-50"
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Options */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg text-slate-800 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-slate-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="text-slate-800">Notifications</span>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-slate-600" />
                <span className="text-slate-800">Privacy & Security</span>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-slate-600" />
                <span className="text-slate-800">Preferences</span>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardContent className="p-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
