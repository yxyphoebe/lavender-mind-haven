
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useTherapists } from '@/hooks/useTherapists';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type TherapistRecommendation = Tables<'therapist_recommendations'>;
type Therapist = Tables<'therapists'>;

interface TherapistWithScore extends Therapist {
  recommendation_score: number;
  reasoning: any;
}

const PersonaSelection = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [recommendations, setRecommendations] = useState<TherapistWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, completeOnboarding } = useUser();
  const { data: allTherapists } = useTherapists();
  const { toast } = useToast();

  useEffect(() => {
    if (user && allTherapists) {
      fetchRecommendations();
    }
  }, [user, allTherapists]);

  const fetchRecommendations = async () => {
    try {
      if (!user || !allTherapists) return;

      const { data, error } = await supabase
        .from('therapist_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('recommendation_score', { ascending: false });

      if (error) throw error;

      // Merge therapist data with recommendations
      const therapistsWithScores = allTherapists.map(therapist => {
        const recommendation = data?.find(r => r.therapist_id === therapist.id);
        return {
          ...therapist,
          recommendation_score: recommendation?.recommendation_score || 0.5,
          reasoning: recommendation?.reasoning || {}
        };
      }).sort((a, b) => b.recommendation_score - a.recommendation_score);

      setRecommendations(therapistsWithScores);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to showing all therapists
      if (allTherapists) {
        setRecommendations(allTherapists.map(t => ({
          ...t,
          recommendation_score: 0.5,
          reasoning: {}
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTherapist = async () => {
    try {
      if (!selectedTherapist || !user) return;

      await completeOnboarding(selectedTherapist);
      
      toast({
        title: "Perfect Choice!",
        description: "Your soul companion is ready to begin this journey with you.",
      });
      
      navigate('/user-center');
    } catch (error) {
      console.error('Error selecting therapist:', error);
      toast({
        title: "Error",
        description: "Failed to save your selection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRecommendationBadge = (score: number) => {
    if (score >= 0.8) return { text: 'Perfect Match', color: 'bg-green-500' };
    if (score >= 0.6) return { text: 'Great Match', color: 'bg-blue-500' };
    if (score >= 0.4) return { text: 'Good Match', color: 'bg-yellow-500' };
    return { text: 'Possible Match', color: 'bg-gray-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-lg">Finding your perfect soul companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">Choose Your Soul Companion</h1>
          <p className="text-lg text-gray-600">
            Based on your responses, we've found companions who resonate with your journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((therapist, index) => {
            const badge = getRecommendationBadge(therapist.recommendation_score);
            const isSelected = selectedTherapist === therapist.id;
            const isTopMatch = index === 0;

            return (
              <Card
                key={therapist.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  isSelected 
                    ? 'ring-2 ring-violet-500 bg-violet-50' 
                    : 'hover:shadow-lg'
                } ${isTopMatch ? 'border-2 border-violet-300' : ''}`}
                onClick={() => setSelectedTherapist(therapist.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage 
                          src={therapist.image_url || ''} 
                          alt={`${therapist.name} avatar`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-violet-400 to-violet-500 text-white text-xl">
                          {therapist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-violet-500 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {therapist.name}
                          </h3>
                          <p className="text-sm text-gray-600">Age: {therapist.age_range}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={`${badge.color} text-white text-xs`}>
                            {badge.text}
                          </Badge>
                          {isTopMatch && (
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 mr-1" />
                              <span className="text-xs">Top Match</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {therapist.style}
                      </p>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-pink-500">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-xs">
                            {Math.round(therapist.recommendation_score * 100)}% compatibility
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={handleSelectTherapist}
            disabled={!selectedTherapist}
            size="lg"
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
          >
            Begin Your Journey Together
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
