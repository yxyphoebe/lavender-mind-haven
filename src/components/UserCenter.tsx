
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Heart, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit3,
  Calendar,
  BarChart3,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonaAvatar from './PersonaAvatar';

const UserCenter = () => {
  const navigate = useNavigate();
  const [selectedPersona] = useState(localStorage.getItem('selectedPersona') || 'nuva');
  
  // Mock user data - in real app this would come from auth/database
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    joinDate: 'March 2024',
    sessionsCompleted: 23,
    currentStreak: 7,
    membershipType: 'Premium'
  };

  const menuItems = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information',
      action: () => console.log('Profile Settings')
    },
    {
      icon: Heart,
      title: 'AI Companion',
      description: 'Change or customize your AI companion',
      action: () => navigate('/persona-selection')
    },
    {
      icon: BarChart3,
      title: 'Progress & Insights',
      description: 'View your wellness journey statistics',
      action: () => navigate('/growth')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Customize your notification preferences',
      action: () => console.log('Notifications')
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: () => console.log('Privacy')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => console.log('Help')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Profile
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat')}
            className="text-slate-600"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile Card */}
        <Card className="mb-6 zen-shadow bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16 zen-shadow">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="font-display text-xl font-semibold text-slate-800">
                    {user.name}
                  </h2>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.membershipType}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm mb-2">{user.email}</p>
                <p className="text-slate-500 text-xs">Member since {user.joinDate}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 mb-1">{user.sessionsCompleted}</div>
                <div className="text-xs text-slate-600">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 mb-1">{user.currentStreak}</div>
                <div className="text-xs text-slate-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current AI Companion */}
        <Card className="mb-6 zen-shadow bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-rose-500" />
              Your AI Companion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-3">
              <PersonaAvatar personaId={selectedPersona as 'nuva' | 'nova' | 'sage'} size="md" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 capitalize">{selectedPersona}</h3>
                <p className="text-sm text-slate-600">
                  {selectedPersona === 'nuva' && 'Gentle & Empathetic'}
                  {selectedPersona === 'nova' && 'Confident & Direct'}
                  {selectedPersona === 'sage' && 'Wise & Balanced'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/persona-selection')}
                className="text-xs"
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Card
              key={item.title}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm border border-slate-200"
              onClick={item.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                  <div className="w-5 h-5 text-slate-400">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Need help? Contact our support team
          </p>
          <Button
            variant="outline"
            onClick={() => console.log('Logout')}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
