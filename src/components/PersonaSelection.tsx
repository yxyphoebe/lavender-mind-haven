
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flower2, Heart, Zap, Star, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonaSelection = () => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const navigate = useNavigate();

  const personas = [
    {
      id: 'nuva',
      name: 'Nuva',
      tagline: 'Gentle & Empathetic',
      description: 'Nuva offers a warm, nurturing presence with infinite patience. She specializes in creating safe spaces for emotional exploration and healing.',
      traits: ['Compassionate', 'Patient', 'Intuitive', 'Nurturing'],
      icon: Heart,
      gradient: 'from-rose-400 to-rose-600',
      bgGradient: 'from-rose-50 to-pink-50',
      textColor: 'text-rose-700',
      approach: 'Focuses on emotional validation, gentle guidance, and creating a judgment-free environment for healing.',
      bestFor: 'Processing trauma, anxiety support, self-compassion work'
    },
    {
      id: 'nova',
      name: 'Nova',
      tagline: 'Confident & Direct',
      description: 'Nova brings clarity and strength to your wellness journey. She provides practical solutions while maintaining deep empathy and understanding.',
      traits: ['Motivating', 'Clear', 'Empowering', 'Solution-focused'],
      icon: Zap,
      gradient: 'from-lavender-500 to-purple-600',
      bgGradient: 'from-lavender-50 to-purple-50',
      textColor: 'text-lavender-700',
      approach: 'Combines empathy with actionable strategies, helping you build confidence and achieve concrete progress.',
      bestFor: 'Goal achievement, confidence building, overcoming obstacles'
    },
    {
      id: 'sage',
      name: 'Sage',
      tagline: 'Wise & Balanced',
      description: 'Sage draws from ancient wisdom and modern psychology to offer balanced perspectives on life\'s challenges and opportunities for growth.',
      traits: ['Wise', 'Balanced', 'Insightful', 'Grounding'],
      icon: Star,
      gradient: 'from-sage-500 to-emerald-600',
      bgGradient: 'from-sage-50 to-emerald-50',
      textColor: 'text-sage-700',
      approach: 'Integrates mindfulness practices with practical wisdom, helping you find balance and deeper understanding.',
      bestFor: 'Life transitions, mindfulness practice, finding purpose'
    }
  ];

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handleContinue = () => {
    if (selectedPersona) {
      // Store selection and navigate to main app
      localStorage.setItem('selectedPersona', selectedPersona);
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-rose-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-3xl flex items-center justify-center mindful-shadow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
            Choose Your AI Companion
          </h1>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">
            Each companion has a unique approach to supporting your wellness journey. 
            You can always change your choice later.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            const isSelected = selectedPersona === persona.id;
            
            return (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
                  isSelected
                    ? 'border-lavender-400 shadow-xl mindful-shadow'
                    : 'border-lavender-200 hover:border-lavender-300'
                } ${isSelected ? 'ring-4 ring-lavender-200' : ''}`}
                onClick={() => handleSelectPersona(persona.id)}
              >
                <CardContent className="p-6 relative">
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-lavender-600 fill-current" />
                    </div>
                  )}

                  {/* Avatar */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${persona.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 mindful-shadow`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Name and tagline */}
                  <div className="text-center mb-4">
                    <h3 className="font-display text-2xl font-bold text-sage-800 mb-2">
                      {persona.name}
                    </h3>
                    <Badge variant="secondary" className={`${persona.textColor} bg-gradient-to-r ${persona.bgGradient} border-0`}>
                      {persona.tagline}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sage-600 mb-4 leading-relaxed text-center">
                    {persona.description}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {persona.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-sm font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Approach */}
                  <div className="bg-gradient-to-r from-white/50 to-lavender-50/50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-sage-800 mb-2">Approach:</h4>
                    <p className="text-sm text-sage-600 leading-relaxed">
                      {persona.approach}
                    </p>
                  </div>

                  {/* Best for */}
                  <div>
                    <h4 className="font-semibold text-sage-800 mb-2 text-sm">Best for:</h4>
                    <p className="text-sm text-sage-600">
                      {persona.bestFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedPersona}
            className={`px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
              selectedPersona
                ? 'bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white hover:scale-105 mindful-shadow'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedPersona ? `Begin Your Journey with ${personas.find(p => p.id === selectedPersona)?.name}` : 'Select a Companion to Continue'}
          </Button>
        </div>

        {/* Additional info */}
        <div className="text-center mt-8">
          <p className="text-sage-500 text-sm">
            Don't worry - you can change your AI companion anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
