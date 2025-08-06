import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Sparkles, Loader2, ArrowLeft, ArrowRight, Play, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapists } from '@/hooks/useTherapists';
import { VideoAvatar } from '@/components/VideoAvatar';
import { TherapistRecommendation } from '@/utils/therapistRecommendation';

const PersonaSelection = () => {
  const [showMoreMatches, setShowMoreMatches] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentOtherMatchIndex, setCurrentOtherMatchIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<TherapistRecommendation[]>([]);
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Swipe detection
  const minSwipeDistance = 80; // 增加滑动距离阈值，减少误触

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isTransitioning) {
      handleNextTherapist();
    }

    if (isRightSwipe && !isTransitioning) {
      handlePrevTherapist();
    }
  };

  const handleNextTherapist = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentOtherMatchIndex(prev => prev < otherMatches.length - 1 ? prev + 1 : 0);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handlePrevTherapist = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentOtherMatchIndex(prev => prev > 0 ? prev - 1 : otherMatches.length - 1);
    setTimeout(() => setIsTransitioning(false), 400);
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
            <div className="text-center mb-8">
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
                {/* Video/Avatar - Much Larger */}
                <div className="relative mb-6 flex justify-center">
                  <VideoAvatar
                    videoUrl={topMatch.intro_video_url}
                    imageUrl={topMatch.image_url}
                    name={topMatch.name}
                    className="w-80 h-96"
                  />
                </div>

                {/* Name */}
                <h2 className="font-display text-3xl font-bold text-neutral-800 mb-3">
                  {topMatch.name}
                </h2>

                {/* Keywords - Reduced */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {getKeywords(topMatch.style).slice(0, 2).map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-mindful-100 to-enso-100 text-mindful-700 rounded-full text-base font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Begin Button */}
                <Button
                  onClick={() => handleContinue(topMatch.id)}
                  className="w-full max-w-sm bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white py-4 text-xl font-medium rounded-xl hover:scale-105 transition-all duration-300 bloom-shadow mb-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start with {topMatch.name}
                </Button>

                {/* Suggestion */}
                <div className={`mt-4 transition-all duration-1000 ${showSuggestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="text-center">
                    <p className="text-neutral-500 text-base leading-relaxed mb-4">
                      Want to explore other matches?
                    </p>
                    <Button
                      onClick={() => setShowMoreMatches(true)}
                      variant="secondary"
                      className="px-8 py-3 text-lg font-medium"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      View Other Matches
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Expanded View - Other Matches
  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6">
          <Button
            onClick={() => setShowMoreMatches(false)}
            variant="ghost"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-medium">Back</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-start pt-12 px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-800 mb-2">Other Great Matches</h2>
            <p className="text-lg text-neutral-600 mb-6">Swipe to explore your options</p>
          </div>

          {/* Current Therapist Display - Swipeable */}
          {otherMatches[currentOtherMatchIndex] && (
            <div className="relative">
              <div 
                className={`text-center mb-8 ${isTransitioning ? 'transform scale-95 opacity-80 transition-transform duration-400 ease-out' : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="animate-gentle-float">
                  {/* Video/Avatar - Large */}
                  <div className="relative mb-4 flex justify-center">
                    <VideoAvatar
                      videoUrl={otherMatches[currentOtherMatchIndex].intro_video_url}
                      imageUrl={otherMatches[currentOtherMatchIndex].image_url}
                      name={otherMatches[currentOtherMatchIndex].name}
                      className="w-72 h-80"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold text-neutral-800 mb-3">{otherMatches[currentOtherMatchIndex].name}</h3>

                  {/* Keywords - Reduced */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {getKeywords(otherMatches[currentOtherMatchIndex].style).slice(0, 2).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-mindful-100 to-enso-100 text-mindful-700 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {/* Choose Button */}
                  <Button
                    onClick={() => handleContinue(otherMatches[currentOtherMatchIndex].id)}
                    className="w-full max-w-sm bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white py-4 text-lg font-medium rounded-xl hover:scale-105 transition-all duration-300 bloom-shadow mb-4"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Choose {otherMatches[currentOtherMatchIndex].name}
                  </Button>
                </div>
              </div>
              
              {/* Dynamic Arrow Buttons */}
              {otherMatches.length > 1 && (
                <>
                  {/* Navigation Arrows - Always visible but disabled when needed */}
                  <Button
                    onClick={handlePrevTherapist}
                    variant="ghost"
                    size="icon"
                    disabled={currentOtherMatchIndex === 0}
                    className="absolute top-1/2 left-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    onClick={handleNextTherapist}
                    variant="ghost"
                    size="icon"
                    disabled={currentOtherMatchIndex === otherMatches.length - 1}
                    className="absolute top-1/2 right-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>
          )}


          {/* Go Back Option - Removed as we have header button */}
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
