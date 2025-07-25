
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Video, 
  TrendingUp, 
  User, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import MindfulLogo from '@/components/MindfulLogo';

const UserCenter = () => {
  const navigate = useNavigate();
  const selectedTherapistId = localStorage.getItem('selectedTherapistId') || '';
  const [selectedMood, setSelectedMood] = useState('');
  const { data: therapist, isLoading } = useTherapist(selectedTherapistId);
  
  // Get current time for greeting
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Mock user data - simplified for home page
  const user = {
    name: 'friend',
    currentStreak: 7
  };

    const moodOptions = [
      { id: 'peaceful', label: 'Peaceful', icon: '🌸', color: 'from-mindful-100 to-mindful-200 text-mindful-700' },
      { id: 'bright', label: 'Bright', icon: '✨', color: 'from-mindful-100 to-enso-200 text-mindful-700' },
      { id: 'calm', label: 'Calm', icon: '🌊', color: 'from-enso-100 to-enso-200 text-enso-700' },
      { id: 'heavy', label: 'Heavy', icon: '☁️', color: 'from-neutral-100 to-neutral-200 text-neutral-700' }
    ];

  const mainActions = [
    {
      icon: MessageCircle,
      title: 'Start Conversation',
      description: 'Connect through mindful dialogue',
      color: 'from-mindful-400 to-mindful-500',
      action: () => navigate('/chat')
    },
    {
      icon: Video,
      title: 'Video Companion',
      description: 'Experience deeper connection',
      color: 'from-enso-400 to-enso-500',
      action: () => navigate('/video-call')
    },
    {
      icon: TrendingUp,
      title: 'Growth Journey',
      description: 'Track your progress',
      color: 'from-mindful-400 to-enso-500',
      action: () => navigate('/growth')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-neutral-600 mb-4">Please select a therapist first</p>
          <Button onClick={() => navigate('/persona-selection')}>
            Choose Therapist
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100">
      <div className="container mx-auto px-4 py-6 max-w-md relative">
        {/* Profile Button - Top Right */}
        <div className="absolute top-6 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <User className="w-5 h-5 text-neutral-600" />
          </Button>
        </div>

        {/* Greeting with AI Therapist Avatar */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="w-32 h-32 zen-shadow animate-fade-in">
              <AvatarImage 
                src={therapist.image_url || ''} 
                alt={`${therapist.name} avatar`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-mindful-400 to-enso-500 text-white text-4xl">
                {therapist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className="mindful-gradient-text text-3xl mb-2">
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-neutral-600 text-lg mb-4">
            I'm {therapist.name}, ready to support your journey
          </p>
          
            {/* Streak indicator */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-mindful-50 to-enso-50 backdrop-blur-sm rounded-full px-4 py-2 zen-shadow border border-mindful-200">
              <Sparkles className="w-4 h-4 text-mindful-500" />
              <span className="text-sm text-mindful-700 font-medium">{user.currentStreak} day streak</span>
            </div>
        </div>

        {/* Quick Mood Check */}
        <Card className="mb-8 bg-gradient-to-br from-mindful-50 to-enso-50 border border-mindful-200 zen-shadow">
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-semibold text-neutral-800 mb-4 text-center">
              How are you feeling today?
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.id)}
                    className={`h-auto p-3 justify-start bg-gradient-to-r ${
                      selectedMood === mood.id 
                        ? 'from-mindful-500 to-enso-500 text-white' 
                        : mood.color
                    } border-0 hover:scale-105 transition-all duration-300`}
                >
                  <span className="text-lg mr-2">{mood.icon}</span>
                  <span className="font-medium text-sm">{mood.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation */}
        <div className="space-y-4 mb-8">
          {mainActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-mindful-50 to-enso-50 border border-mindful-200 zen-shadow"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-neutral-800 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-neutral-600">{action.description}</p>
                  </div>
                  <div className="text-neutral-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
