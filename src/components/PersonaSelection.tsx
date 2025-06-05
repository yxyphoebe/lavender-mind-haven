
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonaAvatar from './PersonaAvatar';

const PersonaSelection = () => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const navigate = useNavigate();

  const personas = [
    {
      id: 'nuva' as const,
      name: 'Nuva',
      tagline: 'Gentle & Empathetic',
      description: 'Nuva offers a warm, nurturing presence with infinite patience. She specializes in creating safe spaces for emotional exploration and healing.',
      traits: ['Compassionate', 'Patient', 'Intuitive', 'Nurturing'],
      bgGradient: 'from-rose-50 to-pink-50',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-200',
      selectedBorder: 'border-rose-400',
      selectedRing: 'ring-rose-200',
      approach: 'Focuses on emotional validation, gentle guidance, and creating a judgment-free environment for healing.',
      bestFor: 'Processing trauma, anxiety support, self-compassion work'
    },
    {
      id: 'nova' as const,
      name: 'Nova',
      tagline: 'Confident & Direct',
      description: 'Nova brings clarity and strength to your wellness journey. She provides practical solutions while maintaining deep empathy and understanding.',
      traits: ['Motivating', 'Clear', 'Empowering', 'Solution-focused'],
      bgGradient: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      selectedBorder: 'border-amber-400',
      selectedRing: 'ring-amber-200',
      approach: 'Combines empathy with actionable strategies, helping you build confidence and achieve concrete progress.',
      bestFor: 'Goal achievement, confidence building, overcoming obstacles'
    },
    {
      id: 'sage' as const,
      name: 'Sage',
      tagline: 'Wise & Balanced',
      description: 'Sage draws from ancient wisdom and modern psychology to offer balanced perspectives on life\'s challenges and opportunities for growth.',
      traits: ['Wise', 'Balanced', 'Insightful', 'Grounding'],
      bgGradient: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      selectedBorder: 'border-emerald-400',
      selectedRing: 'ring-emerald-200',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-400 rounded-3xl flex items-center justify-center zen-shadow">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
            Choose Your AI Companion
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Each companion has a unique approach to supporting your wellness journey. 
            You can always change your choice later.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {personas.map((persona) => {
            const isSelected = selectedPersona === persona.id;
            
            return (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 bg-white/80 backdrop-blur-sm ${
                  isSelected
                    ? `${persona.selectedBorder} shadow-xl zen-shadow ring-4 ${persona.selectedRing}`
                    : `${persona.borderColor} hover:${persona.selectedBorder} hover:shadow-lg`
                }`}
                onClick={() => handleSelectPersona(persona.id)}
              >
                <CardContent className="p-8 relative">
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-6 right-6">
                      <CheckCircle className={`w-6 h-6 ${persona.textColor} fill-current`} />
                    </div>
                  )}

                  {/* Avatar */}
                  <div className="flex justify-center mb-6">
                    <PersonaAvatar personaId={persona.id} size="lg" />
                  </div>

                  {/* Name and tagline */}
                  <div className="text-center mb-6">
                    <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">
                      {persona.name}
                    </h3>
                    <Badge variant="secondary" className={`${persona.textColor} bg-gradient-to-r ${persona.bgGradient} border-0 text-sm px-4 py-1`}>
                      {persona.tagline}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 leading-relaxed text-center">
                    {persona.description}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {persona.traits.map((trait) => (
                      <span
                        key={trait}
                        className={`px-3 py-1.5 ${persona.bgGradient} ${persona.textColor} rounded-full text-sm font-medium border ${persona.borderColor}`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Approach */}
                  <div className={`bg-gradient-to-r ${persona.bgGradient} rounded-xl p-4 mb-4 border ${persona.borderColor}`}>
                    <h4 className="font-semibold text-slate-800 mb-2">Approach:</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {persona.approach}
                    </p>
                  </div>

                  {/* Best for */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm">Best for:</h4>
                    <p className="text-sm text-slate-600">
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
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:scale-105 zen-shadow'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedPersona ? `Begin Your Journey with ${personas.find(p => p.id === selectedPersona)?.name}` : 'Select a Companion to Continue'}
          </Button>
        </div>

        {/* Additional info */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Don't worry - you can change your AI companion anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
