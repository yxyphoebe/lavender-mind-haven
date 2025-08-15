import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapists } from '@/hooks/useTherapists';
import TherapistExperience from './TherapistExperience';

const TherapistManagement = () => {
  const navigate = useNavigate();
  const { data: therapists, isLoading } = useTherapists();
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  
  // Get current therapist from localStorage or default
  const currentTherapistId = localStorage.getItem('selectedTherapist') || 'sage';
  const currentTherapist = therapists?.find(t => t.name.toLowerCase() === currentTherapistId);

  const handleChangeTherapist = () => {
    setShowExperienceForm(true);
  };

  const handleExperienceSubmitted = () => {
    setShowExperienceForm(false);
    // Show therapist selection
  };

  const handleSelectTherapist = (therapistId: string) => {
    localStorage.setItem('selectedTherapist', therapistId);
    navigate('/profile');
  };

  if (showExperienceForm) {
    return (
      <TherapistExperience
        currentTherapist={currentTherapist?.name || 'Sage'}
        onSubmit={handleExperienceSubmitted}
        onBack={() => setShowExperienceForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm hover:from-blue-100 hover:to-purple-100 shadow-lg border border-blue-100"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </Button>
          
          <h1 className="font-display text-2xl font-bold text-neutral-800">
            Therapist Management
          </h1>
          
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        {/* Current Therapist */}
        {currentTherapist && (
          <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg font-bold text-slate-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Current Therapist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                {currentTherapist.image_url && (
                  <img
                    src={currentTherapist.image_url}
                    alt={currentTherapist.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-lg">{currentTherapist.name}</h3>
                  <p className="text-slate-600 text-sm">{currentTherapist.style}</p>
                  <p className="text-slate-500 text-xs">{currentTherapist.age_range}</p>
                </div>
              </div>
              
              {currentTherapist.background_story && (
                <p className="text-slate-600 text-sm mb-4">{currentTherapist.background_story}</p>
              )}
              
              <Button
                onClick={handleChangeTherapist}
                variant="outline"
                className="w-full h-11 border-blue-200 hover:bg-blue-50 bg-white rounded-xl font-medium text-blue-600"
              >
                Change Therapist
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Available Therapists */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-bold text-slate-800 flex items-center">
              <Star className="w-5 h-5 mr-2 text-amber-500" />
              Available Therapists
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {therapists?.map((therapist) => (
                  <div
                    key={therapist.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      therapist.name.toLowerCase() === currentTherapistId
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {therapist.image_url && (
                        <img
                          src={therapist.image_url}
                          alt={therapist.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{therapist.name}</h4>
                        <p className="text-slate-600 text-sm">{therapist.style}</p>
                        <p className="text-slate-500 text-xs">{therapist.age_range}</p>
                      </div>
                      {therapist.name.toLowerCase() !== currentTherapistId && (
                        <Button
                          onClick={() => handleSelectTherapist(therapist.name.toLowerCase())}
                          size="sm"
                          className="h-8 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-lg text-xs font-medium"
                        >
                          Select
                        </Button>
                      )}
                      {therapist.name.toLowerCase() === currentTherapistId && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs font-medium">Current</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistManagement;