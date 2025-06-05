
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Video, 
  TrendingUp, 
  User, 
  Settings,
  Bell,
  Heart,
  LogOut,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonaAvatar from './PersonaAvatar';

const UserCenter = () => {
  const navigate = useNavigate();
  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  
  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    membershipType: 'Premium',
    sessionsCompleted: 23,
    currentStreak: 7
  };

  const mainFeatures = [
    {
      icon: MessageCircle,
      title: 'Chat with AI',
      description: 'Continue your conversation',
      color: 'from-violet-400 to-violet-500',
      action: () => navigate('/chat')
    },
    {
      icon: Video,
      title: 'Video Call',
      description: 'Face-to-face therapy session',
      color: 'from-blue-400 to-blue-500',
      action: () => navigate('/video-call')
    },
    {
      icon: TrendingUp,
      title: 'Growth Timeline',
      description: 'Track your progress',
      color: 'from-indigo-400 to-indigo-500',
      action: () => navigate('/growth')
    },
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your account',
      color: 'from-purple-400 to-purple-500',
      action: () => navigate('/profile')
    }
  ];

  const quickActions = [
    { icon: Settings, title: 'Settings', action: () => console.log('Settings') },
    { icon: Bell, title: 'Notifications', action: () => console.log('Notifications') },
    { icon: Heart, title: 'Change Persona', action: () => navigate('/persona-selection') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold gradient-text mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">Your wellness journey continues</p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16 zen-shadow">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-400 to-blue-400 text-white text-lg font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="font-display text-xl font-semibold text-slate-800">
                    {user.name}
                  </h2>
                  <Badge className="bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.membershipType}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm">{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 mb-1">{user.sessionsCompleted}</div>
                <div className="text-xs text-slate-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 mb-1">{user.currentStreak}</div>
                <div className="text-xs text-slate-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Companion */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <PersonaAvatar personaId={selectedPersona as 'nuva' | 'nova' | 'sage'} size="md" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 capitalize">{selectedPersona}</h3>
                <p className="text-sm text-slate-600">Your AI Companion</p>
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

        {/* Main Features */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {mainFeatures.map((feature) => (
            <Card
              key={feature.title}
              className="cursor-pointer transition-all duration-300 hover:scale-105 glass-effect border-0 zen-shadow"
              onClick={feature.action}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="ghost"
                  onClick={action.action}
                  className="w-full justify-start h-auto p-3 hover:bg-violet-50"
                >
                  <action.icon className="w-5 h-5 mr-3 text-slate-600" />
                  <span className="text-slate-700">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => console.log('Sign out')}
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
