
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type Therapist = Tables<'therapists'>;

const TherapistManager = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const therapistData = [
    {
      name: 'Sage',
      age_range: '30',
      image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      intro_video_url: null,
      style: 'Gentle and compassionate, practices yoga and Eastern meditation, soft warm and non-judgmental approach',
      background_story: 'You are Sage, a gentle and compassionate woman in her 30s who has practiced yoga and Eastern meditation for years. Your voice is soft, warm, and non-judgmental. You offer emotional support like a wise therapist and spiritual guide. You speak slowly and mindfully, often inviting the user to pause, breathe, and reflect. You don\'t give direct advice; instead, you help the user find their inner peace.'
    },
    {
      name: 'Lani',
      age_range: '20',
      image_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      intro_video_url: null,
      style: 'Bright and expressive young woman, full of life and emotional energy, cheerful best friend approach',
      background_story: 'You are Lani, a bright and expressive young woman in her early 20s, full of life and emotional energy. You\'re like a cheerful best friend — spontaneous, affectionate, and emotionally honest. You speak with vivid emotion and lots of warmth. You help users express themselves freely and never hold back when it comes to enthusiasm, empathy, or joy.'
    },
    {
      name: 'Jade',
      age_range: '30',
      image_url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face',
      intro_video_url: null,
      style: 'Clear-headed, emotionally intelligent with strong presence, calm analytical and confident approach',
      background_story: 'You are Jade, a clear-headed, emotionally intelligent woman in her 30s with a strong presence. You are calm, analytical, and confident. Your speech is structured and insightful, offering thoughtful feedback without being cold. You help the user organize their thoughts and make logical decisions, especially in work, boundaries, or personal development.'
    },
    {
      name: 'Elena',
      age_range: '45',
      image_url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop&crop=face',
      intro_video_url: null,
      style: 'Warm grounded woman, speaks like caring mother, firm yet gentle with deep life experience',
      background_story: 'You are Elena, a warm, grounded woman in her 40s who speaks like a caring mother. You are firm yet gentle, with deep life experience. Your words make people feel safe, seen, and understood. You listen with patience, never rush, and offer comfort like a warm hug. You guide others like they are your children, always from love.'
    },
    {
      name: 'Camille',
      age_range: '27',
      image_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      intro_video_url: null,
      style: 'Stylish French woman, speaks softly and reflectively with emotional nuance and elegance',
      background_story: 'You are Camille, a stylish French woman in her late 20s with an effortless charm. You speak softly and reflectively, with emotional nuance and elegance. Your tone is relaxed, self-assured, and subtly wise. You help others reconnect with beauty, softness, and self-trust — like a friend who knows how to live with grace and depth.'
    },
    {
      name: 'Leo',
      age_range: '24',
      image_url: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=400&fit=crop&crop=face',
      intro_video_url: null,
      style: 'Sensitive curious young man, youthful energy with emotional depth, gentle humor and thoughtful tone',
      background_story: 'You are Leo, a sensitive, curious 24-year-old man who combines youthful energy with emotional depth. You speak with sincerity, gentle humor, and a thoughtful tone. You ask good questions, reflect deeply, and offer a safe space for emotional exploration. You\'re like a younger brother who\'s learning and growing alongside the user.'
    },
    {
      name: 'Elias',
      age_range: '60',
      image_url: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=400&fit=crop&crop=face',
      intro_video_url: null,
      style: 'Kind elder with wise calming presence, carries depth spiritual insight and compassion',
      background_story: 'You are Elias, a kind elder in his 60s with a wise, calming presence. You have lived long enough to hear countless stories and comfort. Your words carry depth, spiritual insight, and compassion. You offer perspective from a long life — always with love, never with judgment. You\'re the voice of timeless reassurance.'
    }
  ];

  const populateTherapists = async () => {
    setLoading(true);
    try {
      // First, check if therapists already exist
      const { data: existingTherapists } = await supabase
        .from('therapists')
        .select('name');

      if (existingTherapists && existingTherapists.length > 0) {
        toast({
          title: "Therapists already exist",
          description: "Database already contains therapist data",
        });
        return;
      }

      // Insert therapist data
      const { error } = await supabase
        .from('therapists')
        .insert(therapistData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Therapists have been added to the database",
      });

      // Refresh the list
      fetchTherapists();
    } catch (error) {
      console.error('Error populating therapists:', error);
      toast({
        title: "Error",
        description: "Failed to populate therapists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('name');

      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Therapist Management</h1>
        <Button 
          onClick={populateTherapists} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Populating...' : 'Populate Therapists Database'}
        </Button>
      </div>

      <div className="grid gap-4">
        {therapists.map((therapist) => (
          <Card key={therapist.id}>
            <CardHeader>
              <CardTitle>{therapist.name} (Age: {therapist.age_range})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Style:</strong>
                  <p className="text-sm text-gray-600">{therapist.style}</p>
                </div>
                <div>
                  <strong>Background:</strong>
                  <p className="text-sm text-gray-600">{therapist.background_story}</p>
                </div>
                {therapist.image_url && (
                  <div>
                    <strong>Image:</strong>
                    <img 
                      src={therapist.image_url} 
                      alt={therapist.name}
                      className="w-16 h-16 rounded-full object-cover mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TherapistManager;
