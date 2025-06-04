
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, User, Settings, Heart, TrendingUp, LogOut, Bell, Shield, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Profile', description: 'Manage your account', action: () => navigate('/profile') },
    { icon: Heart, label: 'Wellness Goals', description: 'Set and track your goals', action: () => navigate('/goals') },
    { icon: TrendingUp, label: 'Progress', description: 'View your growth timeline', action: () => navigate('/growth') },
    { icon: Bell, label: 'Notifications', description: 'Manage your alerts', action: () => navigate('/notifications') },
    { icon: Settings, label: 'Settings', description: 'App preferences', action: () => navigate('/settings') },
    { icon: Shield, label: 'Privacy', description: 'Data and privacy settings', action: () => navigate('/privacy') },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help and contact us', action: () => navigate('/help') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/chat')}
              className="hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <h1 className="text-2xl font-semibold text-slate-800">Menu</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Your Mindful Space
          </h2>
          <p className="text-slate-600 text-lg">
            Manage your wellness journey and app preferences
          </p>
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={item.label}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-blue-300"
                onClick={item.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{item.label}</h3>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/auth')}
            className="px-8 py-3 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
