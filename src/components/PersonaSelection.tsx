
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapists } from '@/hooks/useTherapists';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const PersonaSelection = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: therapists, isLoading, error } = useTherapists();

  const handleSelectTherapist = (therapistId: string) => {
    setSelectedTherapist(therapistId);
  };

  const handleContinue = () => {
    if (selectedTherapist) {
      localStorage.setItem('selectedTherapistId', selectedTherapist);
      navigate('/user-center');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !therapists || therapists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
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
            选择你的AI心灵伙伴
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            每位伙伴都有独特的陪伴方式，为你的心灵成长之旅提供支持
          </p>
        </div>

        {/* Therapist Carousel */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {therapists.map((therapist) => {
                const isSelected = selectedTherapist === therapist.id;
                
                return (
                  <CarouselItem key={therapist.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[80%]">
                    <Card
                      className={`cursor-pointer transition-all duration-300 border-2 bg-white/90 backdrop-blur-sm h-full ${
                        isSelected
                          ? 'border-rose-400 shadow-xl zen-shadow ring-4 ring-rose-200'
                          : 'border-rose-200 hover:border-rose-400 hover:shadow-lg'
                      }`}
                      onClick={() => handleSelectTherapist(therapist.id)}
                    >
                      <CardContent className="p-6 relative h-full flex flex-col">
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-5 h-5 text-rose-600 fill-current" />
                          </div>
                        )}

                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <Avatar className="w-24 h-24 zen-shadow">
                            <AvatarImage 
                              src={therapist.image_url || ''} 
                              alt={`${therapist.name} avatar`}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-white text-2xl">
                              {therapist.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Name and age */}
                        <div className="text-center mb-4">
                          <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
                            {therapist.name}
                          </h3>
                          <Badge variant="secondary" className="text-rose-700 bg-gradient-to-r from-rose-50 to-pink-50 border-0 text-sm px-3 py-1">
                            Age {therapist.age_range}
                          </Badge>
                        </div>

                        {/* Background story */}
                        <p className="text-slate-600 mb-4 leading-relaxed text-center text-sm flex-grow line-clamp-4">
                          {therapist.background_story}
                        </p>

                        {/* Style */}
                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 border border-rose-200">
                          <h4 className="font-semibold text-slate-800 mb-1 text-sm">治疗风格:</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
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
          {therapists.map((therapist) => (
            <button
              key={therapist.id}
              onClick={() => handleSelectTherapist(therapist.id)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedTherapist === therapist.id
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
            disabled={!selectedTherapist}
            className={`w-full mobile-button text-base font-medium transition-all duration-300 ${
              selectedTherapist
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:scale-105 zen-shadow'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedTherapist ? `开始与${therapists.find(t => t.id === selectedTherapist)?.name}的心灵之旅` : '选择一位伙伴开始'}
          </Button>
        </div>

        {/* Additional info */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            你可以随时在设置中更换AI伙伴
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
