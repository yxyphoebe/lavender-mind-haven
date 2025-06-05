
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
  Crown,
  Sparkles,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Star
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonaAvatar from './PersonaAvatar';

const UserCenter = () => {
  const navigate = useNavigate();
  const selectedPersona = localStorage.getItem('selectedPersona') || 'nuva';
  const [selectedMood, setSelectedMood] = useState('');
  
  // Get current time for greeting
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    membershipType: 'Premium',
    sessionsCompleted: 23,
    currentStreak: 7
  };

  const moodOptions = [
    { id: 'peaceful', label: 'Peaceful', icon: '🌸', color: 'from-pink-100 to-pink-200 text-pink-700' },
    { id: 'bright', label: 'Bright', icon: '✨', color: 'from-yellow-100 to-yellow-200 text-yellow-700' },
    { id: 'calm', label: 'Calm', icon: '🌊', color: 'from-blue-100 to-blue-200 text-blue-700' },
    { id: 'neutral', label: 'Neutral', icon: '🍃', color: 'from-green-100 to-green-200 text-green-700' },
    { id: 'heavy', label: 'Heavy', icon: '☁️', color: 'from-gray-100 to-gray-200 text-gray-700' }
  ];

  const mainActions = [
    {
      icon: MessageCircle,
      title: 'Start a Conversation',
      description: 'Connect through mindful dialogue',
      color: 'from-violet-400 to-violet-500',
      bgColor: 'bg-violet-50',
      action: () => navigate('/chat')
    },
    {
      icon: Video,
      title: 'Video Presence',
      description: 'Experience deeper connection',
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      action: () => navigate('/video-call')
    },
    {
      icon: TrendingUp,
      title: 'Growth Journey',
      description: 'Track your progress',
      color: 'from-indigo-400 to-indigo-500',
      bgColor: 'bg-indigo-50',
      action: () => navigate('/growth')
    },
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Personalize your experience',
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      action: () => navigate('/profile')
    }
  ];

  const personas = {
    nuva: { name: 'Nuva', icon: Heart },
    nova: { name: 'Nova', icon: Zap },
    sage: { name: 'Sage', icon: Star }
  };

  const currentPersona = personas[selectedPersona as keyof typeof personas] || personas.nuva;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Personalized Greeting */}
        <div className="text-center mb-8">
          <Avatar className="w-20 h-20 mx-auto mb-4 zen-shadow">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-violet-400 to-blue-400 text-white text-xl font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            {getGreeting()}, Friend 👋
          </h1>
          <p className="text-slate-600 text-lg">
            {currentPersona.name} is here for you
          </p>
        </div>

        {/* Mood Check-in */}
        <Card className="mb-8 glass-effect border-0 zen-shadow">
          <CardContent className="p-6">
            <h3 className="font-display text-xl font-semibold text-slate-800 mb-4 text-center">
              How is your inner weather today?
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {moodOptions.slice(0, 4).map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`h-auto p-4 justify-start bg-gradient-to-r ${
                    selectedMood === mood.id 
                      ? 'from-violet-500 to-blue-500 text-white' 
                      : mood.color
                  } border-0 hover:scale-105 transition-all duration-300`}
                >
                  <span className="text-lg mr-2">{mood.icon}</span>
                  <span className="font-medium">{mood.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button
                variant={selectedMood === 'heavy' ? "default" : "outline"}
                onClick={() => setSelectedMood('heavy')}
                className={`h-auto p-4 bg-gradient-to-r ${
                  selectedMood === 'heavy' 
                    ? 'from-violet-500 to-blue-500 text-white' 
                    : moodOptions[4].color
                } border-0 hover:scale-105 transition-all duration-300`}
              >
                <span className="text-lg mr-2">☁️</span>
                <span className="font-medium">Heavy</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Actions */}
        <div className="space-y-4 mb-8">
          {mainActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer transition-all duration-300 hover:scale-[1.02] glass-effect border-0 zen-shadow"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-slate-800 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </div>
                  <div className="text-slate-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Stats */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <PersonaAvatar personaId={selectedPersona as 'nuva' | 'nova' | 'sage'} size="md" />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-display text-lg font-semibold text-slate-800">
                    {user.name}
                  </h3>
                  <Badge className="bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.membershipType}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm">{user.email}</p>
              </div>
            </div>

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

        {/* Quick Actions */}
        <Card className="mb-6 glass-effect border-0 zen-shadow">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                onClick={() => console.log('Settings')}
                className="flex flex-col items-center p-4 h-auto hover:bg-violet-50"
              >
                <Settings className="w-5 h-5 mb-2 text-slate-600" />
                <span className="text-xs text-slate-700">Settings</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => console.log('Notifications')}
                className="flex flex-col items-center p-4 h-auto hover:bg-violet-50"
              >
                <Bell className="w-5 h-5 mb-2 text-slate-600" />
                <span className="text-xs text-slate-700">Alerts</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/persona-selection')}
                className="flex flex-col items-center p-4 h-auto hover:bg-violet-50"
              >
                <Heart className="w-5 h-5 mb-2 text-slate-600" />
                <span className="text-xs text-slate-700">Persona</span>
              </Button>
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
