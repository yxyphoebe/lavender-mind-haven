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
      color: 'rose'
    },
    {
      id: '2',
      date: '2024-05-29',
      title: 'First Deep Conversation',
      type: 'breakthrough',
      description: 'You opened up about your anxiety and felt truly heard. This was a moment of genuine connection.',
      emotion: 'relieved',
      icon: Star,
      color: 'lavender'
    },
    {
      id: '3',
      date: '2024-05-28',
      title: 'Practiced Self-Compassion',
      type: 'practice',
      description: 'You noticed your inner critic and chose kindness instead. A beautiful moment of growth.',
      emotion: 'proud',
      icon: Smile,
      color: 'sage'
    },
    {
      id: '4',
      date: '2024-05-27',
      title: 'Emotional Awareness Breakthrough',
      type: 'insight',
      description: 'You identified the connection between your stress and sleep patterns. This insight will serve you well.',
      emotion: 'enlightened',
      icon: TrendingUp,
      color: 'lavender'
    },
    {
      id: '5',
      date: '2024-05-26',
      title: 'Set Healthy Boundaries',
      type: 'action',
      description: 'You practiced saying no to commitments that don\'t serve your well-being. That takes courage.',
      emotion: 'empowered',
      icon: Target,
      color: 'sage'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'breakthrough': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'practice': return 'bg-green-100 text-green-700 border-green-200';
      case 'insight': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'action': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'rose': return 'from-rose-400 to-rose-600';
      case 'lavender': return 'from-lavender-400 to-lavender-600';
      case 'sage': return 'from-sage-400 to-sage-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/chat')}
              className="hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Growth Timeline</h1>
              <p className="text-slate-600">Your journey of healing and growth</p>
            </div>
          </div>
          <Calendar className="w-6 h-6 text-slate-500" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">5</h3>
              <p className="text-slate-600">Days Active</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">3</h3>
              <p className="text-slate-600">Breakthroughs</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">+23%</h3>
              <p className="text-slate-600">Mood Improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-purple-300"></div>

          <div className="space-y-6">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              
              return (
                <div key={milestone.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline dot */}
                  <div className={`absolute left-6 w-4 h-4 bg-gradient-to-br ${getIconColor(milestone.color)} rounded-full border-4 border-white shadow-lg z-10`}></div>
                  
                  {/* Content card */}
                  <div className="ml-20">
                    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg hover:scale-[1.02] transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getIconColor(milestone.color)} rounded-2xl flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-slate-800 mb-1">
                                {milestone.title}
                              </CardTitle>
                              <div className="flex items-center space-x-2">
                                <Badge className={`${getTypeColor(milestone.type)} border text-xs`}>
                                  {milestone.type}
                                </Badge>
                                <span className="text-sm text-slate-500">
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
                      <CardContent>
                        <p className="text-slate-600 leading-relaxed mb-3">
                          {milestone.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-500">Feeling:</span>
                          <Badge variant="outline" className="text-slate-600 border-slate-300">
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
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg mt-12">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              You're Making Beautiful Progress
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
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
