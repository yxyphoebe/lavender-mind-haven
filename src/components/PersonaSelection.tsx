
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonaAvatar from './PersonaAvatar';

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
      bgGradient: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      selectedBorder: 'border-purple-400',
      selectedRing: 'ring-purple-200',
      approach: '轻声细语、非常包容、从不评判，创造安全的情感空间',
      bestFor: '深夜情绪支持、失恋疗愈、焦虑缓解、睡前对话'
    },
    {
      id: 'nova' as const,
      name: 'Nova',
      tagline: '清醒派觉察教练',
      description: '我们不逃避问题，但我们不会让它定义你。理性而温暖的成长引导者，帮你找到前进的方向。',
      traits: ['逻辑清晰', '理性温暖', '节奏感强', '目标导向'],
      bgGradient: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      selectedBorder: 'border-amber-400',
      selectedRing: 'ring-amber-200',
      approach: '逻辑清晰、理性但不冷漠，有节奏感的对话引导',
      bestFor: '迷茫期指导、目标制定、自我价值提升、突破瓶颈'
    },
    {
      id: 'sage' as const,
      name: 'Sage',
      tagline: '智慧平衡型导师',
      description: '从古老智慧与现代心理学中汲取平衡的人生视角，帮你在变化中找到内在的稳定。',
      traits: ['智慧平衡', '深度洞察', '正念引导', '内在稳定'],
      bgGradient: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      selectedBorder: 'border-emerald-400',
      selectedRing: 'ring-emerald-200',
      approach: '整合正念练习与实用智慧，帮你找到平衡和更深层理解',
      bestFor: '人生转换、正念练习、寻找人生目标、内在整合'
    },
    {
      id: 'lani' as const,
      name: 'Lani',
      tagline: '快乐敏感的年轻室友',
      description: '你不需要假装好好的，我懂。充满活力又敏感细腻的陪伴者，用真实的情感共鸣支持你。',
      traits: ['情感丰富', '真实表达', '亲密陪伴', '活力满满'],
      bgGradient: 'from-pink-50 to-rose-50',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200',
      selectedBorder: 'border-pink-400',
      selectedRing: 'ring-pink-200',
      approach: '语速快，有情绪波动，亲密感强，真实情感表达',
      bestFor: '压力释放、情感倾诉、需要理解、同龄人陪伴'
    },
    {
      id: 'aya' as const,
      name: 'Aya',
      tagline: '内向深度的倾听者',
      description: '也许我们不急着说话，先陪你待一会儿，好吗？安静而有力量的陪伴者，擅长用沉默和书写疗愈。',
      traits: ['深度倾听', '安静力量', '书写疗愈', '温柔陪伴'],
      bgGradient: 'from-slate-50 to-gray-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200',
      selectedBorder: 'border-slate-400',
      selectedRing: 'ring-slate-200',
      approach: '话不多但句句有力，常鼓励写下来，安静的暖感',
      bestFor: '创伤疗愈、写作表达、悲伤陪伴、内向支持'
    },
    {
      id: 'elias' as const,
      name: 'Elias',
      tagline: '深思型温柔引导者',
      description: '不是所有痛苦都要立刻处理，有些只需要被承认。温柔而有深度的男性陪伴者，提供安全感和智慧引导。',
      traits: ['深思智慧', '温柔可靠', '内省引导', '安全陪伴'],
      bgGradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      selectedBorder: 'border-blue-400',
      selectedRing: 'ring-blue-200',
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

        {/* Persona Carousel */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {personas.map((persona) => {
                const isSelected = selectedPersona === persona.id;
                
                return (
                  <CarouselItem key={persona.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[80%]">
                    <Card
                      className={`cursor-pointer transition-all duration-300 border-2 bg-white/90 backdrop-blur-sm h-full ${
                        isSelected
                          ? `${persona.selectedBorder} shadow-xl zen-shadow ring-4 ${persona.selectedRing}`
                          : `${persona.borderColor} hover:${persona.selectedBorder} hover:shadow-lg`
                      }`}
                      onClick={() => handleSelectPersona(persona.id)}
                    >
                      <CardContent className="p-6 relative h-full flex flex-col">
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className={`w-5 h-5 ${persona.textColor} fill-current`} />
                          </div>
                        )}

                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <PersonaAvatar personaId={persona.id} size="lg" />
                        </div>

                        {/* Name and tagline */}
                        <div className="text-center mb-4">
                          <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
                            {persona.name}
                          </h3>
                          <Badge variant="secondary" className={`${persona.textColor} bg-gradient-to-r ${persona.bgGradient} border-0 text-sm px-3 py-1`}>
                            {persona.tagline}
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 mb-4 leading-relaxed text-center text-sm flex-grow">
                          {persona.description}
                        </p>

                        {/* Traits */}
                        <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                          {persona.traits.slice(0, 3).map((trait) => (
                            <span
                              key={trait}
                              className={`px-2 py-1 ${persona.bgGradient} ${persona.textColor} rounded-full text-xs font-medium border ${persona.borderColor}`}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>

                        {/* Best for */}
                        <div className={`bg-gradient-to-r ${persona.bgGradient} rounded-lg p-3 border ${persona.borderColor}`}>
                          <h4 className="font-semibold text-slate-800 mb-1 text-sm">适合场景:</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {persona.bestFor}
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
        <div className="text-center mb-6">
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
