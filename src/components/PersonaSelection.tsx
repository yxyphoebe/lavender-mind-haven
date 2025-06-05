
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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
      // Store selection and navigate to user center instead of chat
      localStorage.setItem('selectedPersona', selectedPersona);
      navigate('/user-center');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-3xl flex items-center justify-center zen-shadow">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold gradient-text mb-3">
            Choose Your AI Companion
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Each companion has a unique way to support your wellness journey
          </p>
        </div>

        {/* Persona Carousel */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {personas.map((persona) => {
                const isSelected = selectedPersona === persona.id;
                
                return (
                  <CarouselItem key={persona.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[80%]">
                    <Card
                      className={`cursor-pointer transition-all duration-300 border-2 bg-white/90 backdrop-blur-sm h-full ${
                        isSelected
                          ? `${persona.selectedBorder} shadow-xl zen-shadow ring-4 ${persona.selectedRing}`
                          : `${persona.borderColor} hover:${persona.selectedBorder} hover:shadow-lg`
                      }`}
                      onClick={() => handleSelectPersona(persona.id)}
                    >
                      <CardContent className="p-6 relative h-full flex flex-col">
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className={`w-5 h-5 ${persona.textColor} fill-current`} />
                          </div>
                        )}

                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <PersonaAvatar personaId={persona.id} size="lg" />
                        </div>

                        {/* Name and tagline */}
                        <div className="text-center mb-4">
                          <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
                            {persona.name}
                          </h3>
                          <Badge variant="secondary" className={`${persona.textColor} bg-gradient-to-r ${persona.bgGradient} border-0 text-sm px-3 py-1`}>
                            {persona.tagline}
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 mb-4 leading-relaxed text-center text-sm flex-grow">
                          {persona.description}
                        </p>

                        {/* Traits */}
                        <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                          {persona.traits.slice(0, 3).map((trait) => (
                            <span
                              key={trait}
                              className={`px-2 py-1 ${persona.bgGradient} ${persona.textColor} rounded-full text-xs font-medium border ${persona.borderColor}`}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>

                        {/* Best for */}
                        <div className={`bg-gradient-to-r ${persona.bgGradient} rounded-lg p-3 border ${persona.borderColor}`}>
                          <h4 className="font-semibold text-slate-800 mb-1 text-sm">Best for:</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {persona.bestFor}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Selection indicator dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handleSelectPersona(persona.id)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedPersona === persona.id
                  ? 'bg-rose-400 w-6'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Continue button */}
        <div className="text-center mb-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedPersona}
            className={`w-full mobile-button text-base font-medium transition-all duration-300 ${
              selectedPersona
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:scale-105 zen-shadow'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedPersona ? `Begin Journey with ${personas.find(p => p.id === selectedPersona)?.name}` : 'Select a companion to continue'}
          </Button>
        </div>

        {/* Additional info */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            You can change your AI companion anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
