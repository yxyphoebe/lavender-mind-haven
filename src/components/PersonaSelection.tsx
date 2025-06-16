
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonaSelection = () => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const navigate = useNavigate();

  const personas = [
    {
      id: 'nuva' as const,
      name: 'Nuva',
      tagline: '温柔的心灵守护者',
      description: '在你最不想说话的时候，我也会陪着你。深度共情的心灵陪伴者，专注于情感疗愈和内心平静。',
      traits: ['温柔包容', '深度共情', '治愈能量', '夜晚陪伴'],
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop&crop=face',
      gradient: 'from-purple-400/80 to-pink-500/80',
      textColor: 'text-white',
      approach: '轻声细语、非常包容、从不评判，创造安全的情感空间',
      bestFor: '深夜情绪支持、失恋疗愈、焦虑缓解、睡前对话'
    },
    {
      id: 'nova' as const,
      name: 'Nova',
      tagline: '清醒派觉察教练',
      description: '我们不逃避问题，但我们不会让它定义你。理性而温暖的成长引导者，帮你找到前进的方向。',
      traits: ['逻辑清晰', '理性温暖', '节奏感强', '目标导向'],
      imageUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&h=1200&fit=crop&crop=face',
      gradient: 'from-amber-400/80 to-orange-500/80',
      textColor: 'text-white',
      approach: '逻辑清晰、理性但不冷漠，有节奏感的对话引导',
      bestFor: '迷茫期指导、目标制定、自我价值提升、突破瓶颈'
    },
    {
      id: 'sage' as const,
      name: 'Sage',
      tagline: '智慧平衡型导师',
      description: '从古老智慧与现代心理学中汲取平衡的人生视角，帮你在变化中找到内在的稳定。',
      traits: ['智慧平衡', '深度洞察', '正念引导', '内在稳定'],
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1200&fit=crop&crop=face',
      gradient: 'from-emerald-400/80 to-green-500/80',
      textColor: 'text-white',
      approach: '整合正念练习与实用智慧，帮你找到平衡和更深层理解',
      bestFor: '人生转换、正念练习、寻找人生目标、内在整合'
    },
    {
      id: 'lani' as const,
      name: 'Lani',
      tagline: '快乐敏感的年轻室友',
      description: '你不需要假装好好的，我懂。充满活力又敏感细腻的陪伴者，用真实的情感共鸣支持你。',
      traits: ['情感丰富', '真实表达', '亲密陪伴', '活力满满'],
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=1200&fit=crop&crop=face',
      gradient: 'from-pink-400/80 to-rose-500/80',
      textColor: 'text-white',
      approach: '语速快，有情绪波动，亲密感强，真实情感表达',
      bestFor: '压力释放、情感倾诉、需要理解、同龄人陪伴'
    },
    {
      id: 'aya' as const,
      name: 'Aya',
      tagline: '内向深度的倾听者',
      description: '也许我们不急着说话，先陪你待一会儿，好吗？安静而有力量的陪伴者，擅长用沉默和书写疗愈。',
      traits: ['深度倾听', '安静力量', '书写疗愈', '温柔陪伴'],
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&h=1200&fit=crop&crop=face',
      gradient: 'from-slate-400/80 to-gray-500/80',
      textColor: 'text-white',
      approach: '话不多但句句有力，常鼓励写下来，安静的暖感',
      bestFor: '创伤疗愈、写作表达、悲伤陪伴、内向支持'
    },
    {
      id: 'elias' as const,
      name: 'Elias',
      tagline: '深思型温柔引导者',
      description: '不是所有痛苦都要立刻处理，有些只需要被承认。温柔而有深度的男性陪伴者，提供安全感和智慧引导。',
      traits: ['深思智慧', '温柔可靠', '内省引导', '安全陪伴'],
      imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=1200&fit=crop&crop=face',
      gradient: 'from-blue-400/80 to-indigo-500/80',
      textColor: 'text-white',
      approach: '低沉温柔、语速稳，鼓励沉淀和自我觉察',
      bestFor: '夜晚焦虑、失眠陪伴、迷茫期整理、深度理解'
    }
  ];

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handleContinue = () => {
    if (selectedPersona) {
      localStorage.setItem('selectedPersona', selectedPersona);
      navigate('/user-center');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-6 px-4 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center zen-shadow">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-xl font-bold gradient-text mb-2">
            选择你的AI心灵伙伴
          </h1>
          <p className="text-sm text-slate-600">
            每位伙伴都有独特的陪伴方式
          </p>
        </div>

        {/* Large Image Persona Carousel */}
        <div className="flex-1 px-4 mb-4">
          <Carousel className="w-full h-full">
            <CarouselContent className="-ml-2 h-full">
              {personas.map((persona) => {
                const isSelected = selectedPersona === persona.id;
                
                return (
                  <CarouselItem key={persona.id} className="pl-2 h-full">
                    <div className="h-full">
                      <Card
                        className={`cursor-pointer transition-all duration-300 border-2 h-full overflow-hidden ${
                          isSelected
                            ? 'border-white shadow-2xl ring-4 ring-white/50'
                            : 'border-white/50 hover:border-white hover:shadow-xl'
                        }`}
                        onClick={() => handleSelectPersona(persona.id)}
                      >
                        <CardContent className="p-0 relative h-full">
                          {/* Large Background Image */}
                          <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${persona.imageUrl})` }}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${persona.gradient}`} />
                          
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-4 right-4 z-10">
                              <CheckCircle className="w-6 h-6 text-white fill-current" />
                            </div>
                          )}

                          {/* Content Overlay */}
                          <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                            {/* Name and tagline */}
                            <div className="mb-4">
                              <h3 className="font-display text-2xl font-bold mb-2">
                                {persona.name}
                              </h3>
                              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-3 py-1 mb-3">
                                {persona.tagline}
                              </Badge>
                            </div>

                            {/* Description */}
                            <p className="text-white/90 mb-4 leading-relaxed text-sm">
                              {persona.description}
                            </p>

                            {/* Traits */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {persona.traits.slice(0, 3).map((trait) => (
                                <span
                                  key={trait}
                                  className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-white/30"
                                >
                                  {trait}
                                </span>
                              ))}
                            </div>

                            {/* Best for */}
                            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                              <h4 className="font-semibold text-white mb-1 text-sm">适合场景:</h4>
                              <p className="text-xs text-white/90 leading-relaxed">
                                {persona.bestFor}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
            <CarouselNext className="right-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
          </Carousel>
        </div>

        {/* Selection indicator dots */}
        <div className="flex justify-center space-x-2 mb-6 px-4">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handleSelectPersona(persona.id)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedPersona === persona.id
                  ? 'bg-rose-400 w-6'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Continue button */}
        <div className="px-4 pb-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedPersona}
            className={`w-full mobile-button text-base font-medium transition-all duration-300 ${
              selectedPersona
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:scale-105 zen-shadow'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedPersona ? `开始与${personas.find(p => p.id === selectedPersona)?.name}的心灵之旅` : '选择一位伙伴开始'}
          </Button>
          
          <p className="text-center text-slate-500 text-sm mt-3">
            你可以随时在设置中更换AI伙伴
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
