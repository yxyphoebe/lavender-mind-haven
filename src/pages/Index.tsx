
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flower2, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MindfulLogo from '@/components/MindfulLogo';

const Index = () => {
  const [showLaunchAnimation, setShowLaunchAnimation] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => setAnimationPhase(3), 3000);
    const timer4 = setTimeout(() => setShowLaunchAnimation(false), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  if (showLaunchAnimation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 overflow-hidden">
        <div className="text-center px-6 relative">
          {/* Main text animation */}
          <div className={`transition-all duration-1000 ${animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center mb-4">
              <MindfulLogo size="lg" className="mr-4" />
            </div>
            <h1 className="mindful-title mb-4 leading-tight">
              MINDFUL AI
            </h1>
            <p className={`text-lg md:text-xl text-slate-600 font-light transition-all duration-1000 delay-300 ${animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              your personal space to heal and grow
            </p>
          </div>

          {/* Flower blooming animation */}
          <div className={`mt-12 flex justify-center transition-all duration-2000 ${animationPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative">
              {/* Rock/crack base */}
              <div className="w-32 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-60"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-500 opacity-40"></div>
              
              {/* Blooming flower */}
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-2000 ${animationPhase >= 2 ? 'animate-bloom' : 'scale-0 opacity-0'}`}>
                <Flower2 className="w-16 h-16 text-purple-400 bloom-shadow" />
                
                {/* Sparkles around flower */}
                <div className={`absolute -top-2 -left-2 transition-all duration-1000 delay-1000 ${animationPhase >= 3 ? 'animate-gentle-float opacity-60' : 'opacity-0'}`}>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className={`absolute -top-1 -right-3 transition-all duration-1000 delay-1200 ${animationPhase >= 3 ? 'animate-gentle-float opacity-60' : 'opacity-0'}`}>
                  <Sparkles className="w-3 h-3 text-blue-400" />
                </div>
                <div className={`absolute -bottom-1 -left-3 transition-all duration-1000 delay-1400 ${animationPhase >= 3 ? 'animate-gentle-float opacity-60' : 'opacity-0'}`}>
                  <Sparkles className="w-3 h-3 text-sky-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Healing message */}
          <div className={`mt-16 transition-all duration-1000 delay-2000 ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-sm font-light italic">Finding strength in gentle moments</span>
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>
      </div>
    );
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
