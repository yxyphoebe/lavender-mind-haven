
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Heart, TrendingUp, Star, Target, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GrowthTimeline = () => {
  const navigate = useNavigate();

  const milestones = [
    {
      id: '1',
      date: '2024-05-30',
      title: 'Started Your Mindful Journey',
      type: 'milestone',
      description: 'Welcome to Mindful AI! You took the first brave step toward healing and growth.',
      emotion: 'hopeful',
      icon: Heart,
      color: 'violet'
    },
    {
      id: '2',
      date: '2024-05-29',
      title: 'First Deep Conversation',
      type: 'breakthrough',
      description: 'You opened up about your anxiety and felt truly heard. This was a moment of genuine connection.',
      emotion: 'relieved',
      icon: Star,
      color: 'blue'
    },
    {
      id: '3',
      date: '2024-05-28',
      title: 'Practiced Self-Compassion',
      type: 'practice',
      description: 'You noticed your inner critic and chose kindness instead. A beautiful moment of growth.',
      emotion: 'proud',
      icon: Smile,
      color: 'indigo'
    },
    {
      id: '4',
      date: '2024-05-27',
      title: 'Emotional Awareness Breakthrough',
      type: 'insight',
      description: 'You identified the connection between your stress and sleep patterns. This insight will serve you well.',
      emotion: 'enlightened',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: '5',
      date: '2024-05-26',
      title: 'Set Healthy Boundaries',
      type: 'action',
      description: 'You practiced saying no to commitments that don\'t serve your well-being. That takes courage.',
      emotion: 'empowered',
      icon: Target,
      color: 'indigo'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'breakthrough': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'practice': return 'bg-green-100 text-green-700 border-green-200';
      case 'insight': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'action': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'violet': return 'from-violet-400 to-violet-600';
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'indigo': return 'from-indigo-400 to-indigo-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-violet-200 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="hover:bg-violet-100 rounded-xl h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="font-display text-lg sm:text-2xl font-bold text-neutral-800">Growth Timeline</h1>
              <p className="text-xs sm:text-sm text-slate-600">Your journey of healing and growth</p>
            </div>
          </div>
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-300 to-blue-300"></div>

          <div className="space-y-4 sm:space-y-6">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              
              return (
                <div key={milestone.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline dot */}
                  <div className={`absolute left-4 sm:left-6 w-4 h-4 bg-gradient-to-br ${getIconColor(milestone.color)} rounded-full border-4 border-white shadow-lg z-10`}></div>
                  
                  {/* Content card */}
                  <div className="ml-14 sm:ml-20">
                    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow hover:scale-[1.02] transition-all duration-300">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 sm:space-x-3 w-full">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getIconColor(milestone.color)} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 mb-1 leading-tight">
                                {milestone.title}
                              </CardTitle>
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <Badge className={`${getTypeColor(milestone.type)} border text-xs w-fit`}>
                                  {milestone.type}
                                </Badge>
                                <span className="text-xs sm:text-sm text-slate-500">
                                  {new Date(milestone.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3">
                          {milestone.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm text-slate-500">Feeling:</span>
                          <Badge variant="outline" className="text-xs sm:text-sm text-slate-600 border-slate-300">
                            {milestone.emotion}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Encouragement message */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 zen-shadow mt-8 sm:mt-12">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-400 to-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-800 mb-2 sm:mb-3">
              You're Making Beautiful Progress
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Every step you take on this journey matters. Your willingness to grow, to feel, and to heal 
              is creating ripples of positive change in your life. Keep going - you're exactly where you need to be.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrowthTimeline;
