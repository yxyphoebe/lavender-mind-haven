
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Video, 
  TrendingUp, 
  User, 
  Sparkles,
  Sun,
  Moon,
  Sunrise
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
    if (hour < 12) return '早上好';
    if (hour < 17) return '下午好';
    return '晚上好';
  };

  // Mock user data - simplified for home page
  const user = {
    name: '朋友',
    currentStreak: 7
  };

  const moodOptions = [
    { id: 'peaceful', label: '平静', icon: '🌸', color: 'from-rose-100 to-rose-200 text-rose-700' },
    { id: 'bright', label: '明亮', icon: '✨', color: 'from-purple-100 to-purple-200 text-purple-700' },
    { id: 'calm', label: '沉静', icon: '🌊', color: 'from-blue-100 to-blue-200 text-blue-700' },
    { id: 'heavy', label: '沉重', icon: '☁️', color: 'from-slate-100 to-slate-200 text-slate-700' }
  ];

  const mainActions = [
    {
      icon: MessageCircle,
      title: '开始对话',
      description: '通过正念对话建立连接',
      color: 'from-violet-400 to-violet-500',
      action: () => navigate('/chat')
    },
    {
      icon: Video,
      title: '视频陪伴',
      description: '体验更深层的连接',
      color: 'from-blue-400 to-blue-500',
      action: () => navigate('/video-call')
    },
    {
      icon: TrendingUp,
      title: '成长轨迹',
      description: '追踪你的进步',
      color: 'from-indigo-400 to-indigo-500',
      action: () => navigate('/growth')
    }
  ];

  const personas = {
    nuva: { name: 'Nuva' },
    nova: { name: 'Nova' },
    sage: { name: 'Sage' },
    lani: { name: 'Lani' },
    aya: { name: 'Aya' },
    elias: { name: 'Elias' }
  };

  const currentPersona = personas[selectedPersona as keyof typeof personas] || personas.nuva;

  const getPersonalGreeting = () => {
    const greetings = {
      nuva: "我在这里陪着你，准备好倾听 💕",
      nova: "让我们一起闪闪发光吧！ ✨",
      sage: "我在这里与你一同走过这段旅程 🌸",
      lani: "嘿！我懂你的感受，一起聊聊吧 🌈",
      aya: "无需着急，我们可以慢慢来 📖",
      elias: "我在这里，愿意陪你静静坐一会儿 🕯️"
    };
    return greetings[selectedPersona as keyof typeof greetings] || greetings.nuva;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md relative">
        {/* Profile Button - Top Right */}
        <div className="absolute top-6 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <User className="w-5 h-5 text-slate-600" />
          </Button>
        </div>

        {/* Zen Greeting with AI Therapist Avatar */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center mb-4">
            <PersonaAvatar 
              personaId={selectedPersona as 'nuva' | 'nova' | 'sage' | 'lani' | 'aya' | 'elias'} 
              size="lg" 
              className="animate-fade-in"
            />
          </div>
          
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            {getGreeting()}，{user.name}
          </h1>
          <p className="text-slate-600 text-lg mb-4">
            {getPersonalGreeting()}
          </p>
          
          {/* Streak indicator */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-full px-4 py-2 zen-shadow border border-blue-100">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-slate-700 font-medium">{user.currentStreak} 天连续</span>
          </div>
        </div>

        {/* Quick Mood Check */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow">
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-semibold text-slate-800 mb-4 text-center">
              今天感觉如何？
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`h-auto p-3 justify-start bg-gradient-to-r ${
                    selectedMood === mood.id 
                      ? 'from-violet-500 to-blue-500 text-white' 
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
              className="cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
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
      </div>
    </div>
  );
};

export default UserCenter;
