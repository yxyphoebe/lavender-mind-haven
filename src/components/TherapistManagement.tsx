import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapists } from '@/hooks/useTherapists';
import { VideoAvatar } from '@/components/VideoAvatar';

const TherapistManagement = () => {
  const navigate = useNavigate();
  const { data: therapists, isLoading, error } = useTherapists();
  const [currentTherapistIndex, setCurrentTherapistIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Get current therapist from localStorage
  const currentTherapistId = localStorage.getItem('selectedTherapistId');
  
  // Filter out the current therapist from available options
  const availableTherapists = therapists?.filter(therapist => 
    therapist.active && therapist.id !== currentTherapistId
  ) || [];

  const handleSelectTherapist = (therapistId: string) => {
    localStorage.setItem('selectedTherapistId', therapistId);
    navigate('/profile');
  };

  // Swipe detection
  const minSwipeDistance = 80;

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
    setCurrentTherapistIndex(prev => prev < availableTherapists.length - 1 ? prev + 1 : 0);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handlePrevTherapist = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentTherapistIndex(prev => prev > 0 ? prev - 1 : availableTherapists.length - 1);
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
    
    return styleKeywords[Object.keys(styleKeywords).find(name => style?.includes(name)) || ''] || 
           ['Compassionate', 'Understanding', 'Supportive'];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mindful-400" />
      </div>
    );
  }

  if (error || !therapists || therapists.length === 0 || availableTherapists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-neutral-600 mb-4">No available therapists to switch to</p>
          <Button 
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white"
          >
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-50 via-mindful-100 to-enso-100 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-16 pb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-mindful-50 to-enso-50 backdrop-blur-sm hover:from-mindful-100 hover:to-enso-100 shadow-lg border border-mindful-100"
          >
            <ArrowLeft className="w-5 h-5 text-mindful-600" />
          </Button>
          
          <h1 className="font-display text-2xl font-bold text-neutral-800">
            Choose Therapist
          </h1>
          
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-start px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Explore Other Therapists</h2>
            <p className="text-lg text-neutral-600 mb-6">Swipe to find someone new</p>
          </div>

          {/* Current Therapist Display - Swipeable */}
          {availableTherapists[currentTherapistIndex] && (
            <div className="relative">
              <div 
                className={`text-center mb-8 ${isTransitioning ? 'transform scale-95 opacity-80 transition-transform duration-400 ease-out' : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="animate-gentle-float">
                  {/* Video/Avatar - Large */}
                  <div className="relative mb-6 flex justify-center">
                    <VideoAvatar
                      key={`therapist-${availableTherapists[currentTherapistIndex].id}`}
                      videoUrl={availableTherapists[currentTherapistIndex].intro_video_url}
                      imageUrl={availableTherapists[currentTherapistIndex].image_url}
                      name={availableTherapists[currentTherapistIndex].name}
                      className="w-96 h-[28rem]"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold text-neutral-800 mb-3">{availableTherapists[currentTherapistIndex].name}</h3>

                  {/* Keywords */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {getKeywords(availableTherapists[currentTherapistIndex].style).slice(0, 2).map((keyword, index) => (
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
                    onClick={() => handleSelectTherapist(availableTherapists[currentTherapistIndex].id)}
                    className="w-full max-w-sm bg-gradient-to-r from-mindful-400 to-enso-500 hover:from-mindful-500 hover:to-enso-600 text-white py-4 text-lg font-medium rounded-xl hover:scale-105 transition-all duration-300 bloom-shadow mb-6"
                  >
                    Begin with {availableTherapists[currentTherapistIndex].name}
                  </Button>

                  {/* Navigation arrows below button */}
                  {availableTherapists.length > 1 && (
                    <div className="flex justify-center -mt-1">
                      {currentTherapistIndex > 0 && (
                        <Button
                          onClick={handlePrevTherapist}
                          variant="ghost"
                          className="text-neutral-600 hover:text-neutral-800 transition-colors p-0 h-4 w-4 min-h-0 min-w-0"
                        >
                          <ArrowLeft className="w-2 h-2" />
                        </Button>
                      )}
                      
                      {currentTherapistIndex < availableTherapists.length - 1 && (
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

          {/* Go Back Option */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="border-mindful-300 text-mindful-700 hover:bg-mindful-50"
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistManagement;