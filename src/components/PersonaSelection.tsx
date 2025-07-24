import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapists } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TherapistRecommendation } from '@/utils/therapistRecommendation';

const PersonaSelection = () => {
  const [showMoreMatches, setShowMoreMatches] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [recommendations, setRecommendations] = useState<TherapistRecommendation[]>([]);
  const navigate = useNavigate();
  const { data: therapists, isLoading, error } = useTherapists();

  // Load recommendations on component mount
  useEffect(() => {
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
  }, []);

  // Show suggestion after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuggestion(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = (therapistId: string) => {
    localStorage.setItem('selectedTherapistId', therapistId);
    navigate('/user-center');
  };

  const getTherapistRecommendation = (therapistName: string): TherapistRecommendation | null => {
    return recommendations.find(rec => rec.name === therapistName) || null;
  };

  const getEmotionalIntro = (therapist: any, isTopMatch: boolean = false): string => {
    if (isTopMatch) {
      return "We think you'll feel deeply understood with her";
    }
    return "A compassionate soul aligned with your needs.";
  };

  const getKeywords = (style: string): string[] => {
    const styleKeywords: { [key: string]: string[] } = {
      'Sage': ['Mindful', 'Peaceful', 'Wise', 'Grounding'],
      'Camille': ['Empathetic', 'Nurturing', 'Supportive', 'Warm'],
      'Elena': ['Gentle', 'Understanding', 'Calming', 'Patient'],
      'Jade': ['Insightful', 'Clear', 'Focused', 'Direct'],
      'Leo': ['Encouraging', 'Strong', 'Motivating', 'Confident'],
      'Lani': ['Healing', 'Intuitive', 'Compassionate', 'Spiritual'],
      'Elias': ['Practical', 'Logical', 'Solution-focused', 'Steady']
    };
    
    // Try to extract from style text or use name-based defaults
    return styleKeywords[Object.keys(styleKeywords).find(name => style?.includes(name)) || ''] || 
           ['Compassionate', 'Understanding', 'Supportive'];
  };

  // Filter therapists to only show recommended ones and sort by rank
  const recommendedTherapists = therapists?.filter(therapist => 
    recommendations.some(rec => rec.name === therapist.name)
  ).sort((a, b) => {
    const aRec = getTherapistRecommendation(a.name);
    const bRec = getTherapistRecommendation(b.name);
    return (aRec?.rank || 999) - (bRec?.rank || 999);
  }) || [];

  const topMatch = recommendedTherapists[0];
  const otherMatches = recommendedTherapists.slice(1, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mindful-400" />
      </div>
    );
  }

  if (error || !therapists || therapists.length === 0 || recommendedTherapists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-neutral-600 mb-4">No therapist recommendations available</p>
          <Button 
            onClick={() => navigate('/onboarding')}
            className="bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white"
          >
            Take Assessment Again
          </Button>
        </div>
      </div>
    );
  }

  if (!showMoreMatches) {
    // Initial View - Perfect Match
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 safe-area-top safe-area-bottom">
        <div className="max-w-md mx-auto flex flex-col min-h-screen">
          {/* Perfect Match Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="font-display text-3xl font-bold text-neutral-800 mb-3 leading-tight">
                Meet Your Perfect Match
              </h1>
              <p className="text-neutral-600 text-lg font-light leading-relaxed">
                Your emotional support, chosen just for you.
              </p>
            </div>

            {/* Perfect Match Card */}
            {topMatch && (
              <div className="text-center mb-8 animate-gentle-float">
                {/* Avatar with Glow */}
                <div className="relative mb-6 flex justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-mindful-400/30 to-enso-500/30 rounded-xl blur-xl scale-110"></div>
                  <Avatar className="relative w-48 h-64 bloom-shadow ring-4 ring-white/50 rounded-xl">
                    <AvatarImage 
                      src={topMatch.image_url || ''} 
                      alt={`${topMatch.name} avatar`}
                      className="object-cover rounded-xl"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-mindful-400 to-enso-500 text-white text-5xl rounded-xl">
                      {topMatch.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name */}
                <h2 className="font-display text-2xl font-semibold text-neutral-800 mb-2">
                  {topMatch.name}
                </h2>

                {/* Keywords */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {getKeywords(topMatch.style).slice(0, 3).map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-mindful-100 to-enso-100 text-mindful-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Emotional Intro */}
                <p className="text-lg text-neutral-700 font-light italic leading-relaxed mb-8 max-w-xs mx-auto">
                  "{getEmotionalIntro(topMatch, true)}"
                </p>

                {/* Begin Button */}
                <Button
                  onClick={() => handleContinue(topMatch.id)}
                  className="w-full max-w-xs bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white py-4 text-lg font-medium rounded-xl hover:scale-105 transition-all duration-300 bloom-shadow"
                >
                  Begin Your Journey with {topMatch.name}
                </Button>
              </div>
            )}
          </div>

          {/* Subtle Suggestion */}
          <div className={`px-6 pb-8 transition-all duration-1000 ${showSuggestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center">
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                Not quite feeling it?<br />
                🌿 We've also found two more companions who deeply resonate with your vibe.<br />
                Curious to meet them?
              </p>
              <Button
                onClick={() => setShowMoreMatches(true)}
                variant="outline"
                className="border-mindful-300 text-mindful-600 hover:bg-mindful-50 rounded-xl px-6 py-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Explore more matches
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded View - Other Matches
  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 p-4 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Button
            onClick={() => setShowMoreMatches(false)}
            variant="ghost"
            className="mb-4 text-mindful-600 hover:text-mindful-700"
          >
            ← Back to Perfect Match
          </Button>
          <h1 className="font-display text-2xl font-bold text-neutral-800 mb-2">
            More Companions You May Like
          </h1>
          <p className="text-neutral-600 text-sm leading-relaxed">
            These beautiful souls also resonate with your unique energy
          </p>
        </div>

        {/* Other Matches Carousel */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {otherMatches.map((therapist) => {
                const recommendation = getTherapistRecommendation(therapist.name);
                
                return (
                  <CarouselItem key={therapist.id} className="pl-2 md:pl-4">
                    <Card className="cursor-pointer transition-all duration-300 border-2 bg-gradient-to-br from-mindful-50 to-enso-50 backdrop-blur-sm border-mindful-200 zen-shadow hover:border-mindful-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        {/* Rank Badge */}
                        <div className="absolute top-2 right-2">
                          <div className="bg-gradient-to-r from-mindful-400 to-enso-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            #{recommendation?.rank}
                          </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <Avatar className="w-24 h-24 zen-shadow ring-2 ring-mindful-200">
                            <AvatarImage 
                              src={therapist.image_url || ''} 
                              alt={`${therapist.name} avatar`}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-mindful-400 to-enso-500 text-white text-2xl">
                              {therapist.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Name */}
                        <h3 className="font-display text-lg font-semibold text-neutral-800 mb-2">
                          {therapist.name}
                        </h3>

                        {/* Keywords */}
                        <div className="flex flex-wrap justify-center gap-1 mb-3">
                          {getKeywords(therapist.style).slice(0, 2).map((keyword, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-mindful-100 text-mindful-600 rounded-full text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>

                        {/* Emotional intro */}
                        <p className="text-sm text-neutral-600 italic mb-4 leading-relaxed">
                          "{getEmotionalIntro(therapist)}"
                        </p>

                        {/* Choose Button */}
                        <Button
                          onClick={() => handleContinue(therapist.id)}
                          className="w-full bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white py-2 text-sm font-medium rounded-lg transition-all duration-300"
                        >
                          Choose {therapist.name}
                        </Button>
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

        {/* Or go back to perfect match */}
        <div className="text-center">
          <Button
            onClick={() => topMatch && handleContinue(topMatch.id)}
            variant="outline"
            className="border-mindful-300 text-mindful-600 hover:bg-mindful-50 rounded-xl px-8 py-3"
          >
            Actually, I'll go with {topMatch?.name}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
