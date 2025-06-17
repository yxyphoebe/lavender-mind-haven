import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapists } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TherapistRecommendation } from '@/utils/therapistRecommendation';

const PersonaSelection = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<TherapistRecommendation[]>([]);
  const navigate = useNavigate();
  const { data: therapists, isLoading, error } = useTherapists();

  // Load recommendations on component mount
  useState(() => {
    const savedRecommendations = localStorage.getItem('therapistRecommendations');
    if (savedRecommendations) {
      try {
        const parsed = JSON.parse(savedRecommendations);
        setRecommendations(parsed);
        console.log('Loaded therapist recommendations:', parsed);
      } catch (e) {
        console.error('Failed to parse recommendations:', e);
      }
    }
  });

  const handleSelectTherapist = (therapistId: string) => {
    setSelectedTherapist(therapistId);
  };

  const handleContinue = () => {
    if (selectedTherapist) {
      localStorage.setItem('selectedTherapistId', selectedTherapist);
      navigate('/user-center');
    }
  };

  const getTherapistRecommendation = (therapistName: string): TherapistRecommendation | null => {
    return recommendations.find(rec => rec.name === therapistName) || null;
  };

  const isRecommended = (therapistName: string): boolean => {
    return recommendations.some(rec => rec.name === therapistName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !therapists || therapists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">No therapists available</p>
          <Button onClick={() => navigate('/therapist-manager')}>
            Manage Therapists
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 p-4 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-violet-400 rounded-xl flex items-center justify-center zen-shadow">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-xl font-bold gradient-text mb-1">
            Choose Your AI Companion
          </h1>
          <p className="text-slate-600 font-light text-sm leading-relaxed">
            Based on your answers, we've highlighted your top matches ✨
          </p>
        </div>

        {/* Therapist Carousel */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {therapists.map((therapist) => {
                const isSelected = selectedTherapist === therapist.id;
                const recommendation = getTherapistRecommendation(therapist.name);
                const recommended = isRecommended(therapist.name);
                
                return (
                  <CarouselItem key={therapist.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[80%]">
                    <Card
                      className={`cursor-pointer transition-all duration-300 border-2 bg-white/90 backdrop-blur-sm h-full relative ${
                        isSelected
                          ? 'border-blue-400 bg-blue-50 zen-shadow ring-4 ring-blue-200'
                          : recommended
                          ? 'border-gradient-to-r from-yellow-400 to-orange-400 bg-gradient-to-r from-yellow-50 to-orange-50 zen-shadow'
                          : 'border-blue-200 hover:border-blue-300 hover:bg-blue-25'
                      }`}
                      onClick={() => handleSelectTherapist(therapist.id)}
                    >
                      <CardContent className="p-6 relative h-full flex flex-col">
                        {/* Recommendation badge */}
                        {recommended && (
                          <div className="absolute top-2 left-2 z-10">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              #{recommendation?.rank} Match
                            </div>
                          </div>
                        )}

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4 z-10">
                            <CheckCircle className="w-5 h-5 text-blue-600 fill-current" />
                          </div>
                        )}

                        {/* Avatar */}
                        <div className="flex justify-center mb-6">
                          <Avatar className={`w-32 h-32 zen-shadow ${recommended ? 'ring-4 ring-yellow-300' : ''}`}>
                            <AvatarImage 
                              src={therapist.image_url || ''} 
                              alt={`${therapist.name} avatar`}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-violet-500 text-white text-3xl">
                              {therapist.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Name and score */}
                        <div className="text-center mb-6">
                          <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
                            {therapist.name}
                          </h3>
                          {recommendation && (
                            <div className="text-sm text-orange-600 font-semibold">
                              Match Score: {recommendation.score}/4
                            </div>
                          )}
                        </div>

                        {/* Style */}
                        <div className={`rounded-lg p-4 border flex-grow ${
                          recommended 
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                            : 'bg-gradient-to-r from-blue-50 to-violet-50 border-blue-200'
                        }`}>
                          <h4 className="font-semibold text-slate-800 mb-2 text-sm">Therapy Style:</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {therapist.style}
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
        <div className="flex justify-center space-x-2 mb-8 flex-wrap">
          {therapists.map((therapist) => {
            const recommended = isRecommended(therapist.name);
            return (
              <button
                key={therapist.id}
                onClick={() => handleSelectTherapist(therapist.id)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  selectedTherapist === therapist.id
                    ? 'bg-blue-400 w-6'
                    : recommended
                    ? 'bg-yellow-400 hover:bg-yellow-500'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>

        {/* Continue button */}
        <div className="text-center mb-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedTherapist}
            className={`w-full mobile-button text-base font-medium transition-all duration-300 ${
              selectedTherapist
                ? 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white hover:scale-105 zen-shadow'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedTherapist ? `Start Your Journey with ${therapists.find(t => t.id === selectedTherapist)?.name}` : 'Choose a Companion to Begin'}
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
