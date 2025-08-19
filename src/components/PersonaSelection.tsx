import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Sparkles, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapists } from '@/hooks/useTherapists';
import { VideoAvatar } from '@/components/VideoAvatar';
import { TherapistRecommendation } from '@/utils/therapistRecommendation';
import { supabase } from '@/integrations/supabase/client';

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

  const handleContinue = async (therapistId: string) => {
    // Find the selected therapist
    const selectedTherapist = therapists?.find(t => t.id === therapistId);
    if (!selectedTherapist) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update user with both therapist_id and therapist_name
      const { error } = await supabase
        .from('users')
        .update({ 
          selected_therapist_id: selectedTherapist.id,
          therapist_name: selectedTherapist.name,
          onboarding_completed: true 
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user:', error);
        return;
      }

      localStorage.setItem('selectedTherapistId', therapistId);
      
      // Navigate immediately
      navigate('/home');
      
      // Check and generate daily messages in background (no await)
      checkAndGenerateDailyMessages(therapistId);
    } catch (error) {
      console.error('Error in handleContinue:', error);
    }
  };

  const checkAndGenerateDailyMessages = async (therapistId: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user already has 3+ unused messages for this therapist
      const { data: existingMessages } = await supabase
        .from('daily_messages')
        .select('id')
        .eq('user_id', user.id)
        .eq('therapist_id', therapistId)
        .eq('is_used', false);

      // Only generate if fewer than 3 unused messages
      if (!existingMessages || existingMessages.length < 3) {
        console.log('Generating daily messages in background for therapist:', therapistId);
        
        // Call Edge Function without awaiting (fire and forget)
        supabase.functions.invoke('generate-daily-messages', {
          body: { therapistId }
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error generating daily messages:', error);
          } else {
            console.log('Successfully triggered daily message generation:', data);
          }
        });
      } else {
        console.log('User already has enough unused messages:', existingMessages.length);
      }
    } catch (error) {
      console.error('Error in checkAndGenerateDailyMessages:', error);
      // Silently fail - don't impact user experience
    }
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
  // Show all therapists in Other Matches except the Perfect Match
  const otherMatches = therapists?.filter(therapist => 
    therapist.id !== topMatch?.id
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];
  
  // Debug logging for arrows
  console.log('Other matches length:', otherMatches.length);
  console.log('Current other match index:', currentOtherMatchIndex);
  console.log('Other matches data:', otherMatches);

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
          <div className="flex-1 flex flex-col pt-16 px-6 animate-fade-in">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-neutral-800 mb-3 leading-tight">
                Meet Your Perfect Match
              </h1>
            </div>

            {/* Perfect Match Card */}
            {topMatch && (
              <div className="text-center mb-8">
                {/* Video/Avatar - Much Larger */}
                <div className="relative mb-6 flex justify-center">
                  <VideoAvatar
                    key={`perfect-match-${topMatch.id}`}
                    videoUrl={topMatch.intro_video_url}
                    imageUrl={topMatch.image_url}
                    name={topMatch.name}
                    className="w-96 h-[28rem]"
                  />
                </div>

                {/* Name */}
                <h2 className="font-display text-3xl font-bold text-neutral-800 mb-6">
                  {topMatch.name}
                </h2>

                {/* Begin Button */}
                <Button
                  onClick={() => handleContinue(topMatch.id)}
                  className="w-full max-w-sm bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white py-4 text-xl font-medium rounded-xl hover:scale-105 transition-all duration-300 bloom-shadow mb-6"
                >
                  Begin with {topMatch.name}
                </Button>

                {/* Suggestion */}
                <div className={`mt-4 transition-all duration-1000 ${showSuggestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="text-center">
                    <p className="text-neutral-500 text-base leading-relaxed mb-4">
                      Want to explore other matches?
                    </p>
                    <Button
                      onClick={() => setShowMoreMatches(true)}
                      variant="outline"
                      className="border-mindful-300 text-mindful-600 hover:bg-mindful-50 rounded-xl px-8 py-3"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      See Other Matches
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
        {/* Header with back button */}
        <div className="pt-16 px-6 mb-8">
          <Button
            onClick={() => setShowMoreMatches(false)}
            variant="ghost"
            className="p-2 h-auto hover:bg-mindful-100/60 mb-4"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </Button>
          <h2 className="text-2xl font-bold text-neutral-800 text-center">Find Your Energy</h2>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-start px-6">

          {/* Current Therapist Display - Swipeable */}
          {otherMatches[currentOtherMatchIndex] && (
            <div className="relative">
              <div 
                className={`text-center mb-8 ${isTransitioning ? 'transform scale-95 opacity-80 transition-transform duration-400 ease-out' : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div>
                  {/* Video/Avatar - Large */}
                  <div className="relative mb-6 flex justify-center">
                    <VideoAvatar
                      key={`other-match-${otherMatches[currentOtherMatchIndex].id}`}
                      videoUrl={otherMatches[currentOtherMatchIndex].intro_video_url}
                      imageUrl={otherMatches[currentOtherMatchIndex].image_url}
                      name={otherMatches[currentOtherMatchIndex].name}
                      className="w-96 h-[28rem]"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold text-neutral-800 mb-6">{otherMatches[currentOtherMatchIndex].name}</h3>

                  {/* Choose Button */}
                  <Button
                    onClick={() => handleContinue(otherMatches[currentOtherMatchIndex].id)}
                    className="w-full max-w-sm bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white py-4 text-lg font-medium rounded-xl hover:scale-105 transition-all duration-300 bloom-shadow mb-6"
                  >
                    Begin with {otherMatches[currentOtherMatchIndex].name}
                  </Button>

                  {/* Navigation arrows below button */}
                  {otherMatches.length > 1 && (
                    <div className="flex justify-center -mt-1">
                      {currentOtherMatchIndex > 0 && (
                        <Button
                          onClick={handlePrevTherapist}
                          variant="ghost"
                          className="text-neutral-600 hover:text-neutral-800 transition-colors p-0 h-4 w-4 min-h-0 min-w-0"
                        >
                          <ArrowLeft className="w-2 h-2" />
                        </Button>
                      )}
                      
                      {currentOtherMatchIndex < otherMatches.length - 1 && (
                        <Button
                          onClick={handleNextTherapist}
                          variant="ghost"
                          className="text-neutral-600 hover:text-neutral-800 transition-colors p-0 h-4 w-4 min-h-0 min-w-0"
                        >
                          <ArrowRight className="w-2 h-2" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
