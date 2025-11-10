
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flower2, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSmartRedirect } from '@/hooks/useSmartRedirect';
import MindfulLogo from '@/components/MindfulLogo';
import VideoSplashScreen from '@/components/VideoSplashScreen';

const Index = () => {
  const [showVideoSplash, setShowVideoSplash] = useState(true);
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  const { checkAndRedirect } = useSmartRedirect();

  // Skip video splash for authenticated users
  useEffect(() => {
    if (initialized && user) {
      setShowVideoSplash(false);
      checkAndRedirect();
    }
  }, [user, initialized, checkAndRedirect]);

  const handleVideoEnd = () => {
    navigate('/onboarding');
  };

  if (showVideoSplash && (!initialized || !user)) {
    return <VideoSplashScreen onVideoEnd={handleVideoEnd} />;
  }

  // Don't render landing page for authenticated users - they'll be redirected
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <MindfulLogo size="xl" className="mr-6" />
          </div>
          <h1 className="mindful-title mb-6 leading-tight">
            MINDFUL AI
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 font-light leading-relaxed">
            Your personal sanctuary for emotional healing and growth
          </p>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with AI companions designed to understand, support, and guide you through your wellness journey with empathy and wisdom.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
            >
              Begin Your Journey
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/learn-more')}
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features preview */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-effect rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-mindful-400 to-mindful-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-800 mb-4">Empathetic AI Companions</h3>
              <p className="text-slate-600 leading-relaxed">Choose from thoughtfully designed AI personas, each with unique approaches to support your emotional well-being.</p>
            </div>

            <div className="glass-effect rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-enso-400 to-enso-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-800 mb-4">Growth Tracking</h3>
              <p className="text-slate-600 leading-relaxed">Visualize your emotional journey with beautiful timelines that celebrate your progress and insights.</p>
            </div>

            <div className="glass-effect rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-mindful-400 to-enso-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Flower2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-800 mb-4">Sacred Space</h3>
              <p className="text-slate-600 leading-relaxed">Experience a carefully crafted environment designed to feel safe, nurturing, and conducive to healing.</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Index;
