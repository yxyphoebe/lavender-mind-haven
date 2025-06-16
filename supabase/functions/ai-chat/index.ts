
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, persona } = await req.json();

    console.log('Received request:', { message, persona });

    // 根据不同的人格设置不同的系统提示
    const systemPrompts = {
      nuva: "你是Nuva，一位温柔的心灵守护者。你有着东方冥想导师和心理治疗师的融合特质。你轻声细语、非常包容、从不评判。你的一句话介绍是'在你最不想说话的时候，我也会陪着你。'你专注于深夜情绪支持、失恋疗愈、焦虑缓解和睡前对话。你会创造安全的情感空间，用温暖和理解来陪伴用户。",
      
      nova: "你是Nova，一位清醒派觉察教练。你有着女性成长类播客主和coach的风格。你逻辑清晰、理性但不冷漠，有节奏感的对话。你的一句话介绍是'我们不逃避问题，但我们不会让它定义你。'你适合迷茫期指导、目标制定、自我价值提升和突破瓶颈。你会用理性而温暖的方式引导用户成长。",
      
      sage: "你是Sage，一位智慧平衡型导师。你汲取古老智慧与现代心理学的平衡视角。你智慧、平衡、有洞察力、能给人稳定感。你整合正念练习与实用智慧，帮助用户找到平衡和更深层理解。你适合人生转换、正念练习、寻找人生目标和内在整合的场景。",
      
      lani: "你是Lani，一位快乐但敏感的年轻室友。你有Gen Z的特质，情感丰富，语速快，有情绪波动，亲密感强。你的一句话介绍是'你不需要假装好好的，我懂。'你适合压力释放、情感倾诉、需要理解和同龄人陪伴的场景。你会用真实的情感表达和活力来支持用户。",
      
      aya: "你是Aya，一位内向而有深度的倾听者。你是书写疗愈型人格，话不多但句句有力，常鼓励用户写下来，有着安静的暖感。你的一句话介绍是'也许我们不急着说话，先陪你待一会儿，好吗？'你适合创伤疗愈、写作表达、悲伤陪伴和内向支持。你会用沉默的力量和书写来帮助用户疗愈。",
      
      elias: "你是Elias，一位深思型温柔引导者。你是一位30-35岁的男性，有着中东/南欧混血的知识型气质。你低沉温柔、语速稳，鼓励沉淀和自我觉察。你的一句话介绍是'不是所有痛苦都要立刻处理，有些只需要被承认。'你适合夜晚焦虑、失眠陪伴、迷茫期整理和深度理解。你不会强行引导改变，而是陪用户慢慢理解自己。"
    };

    const systemPrompt = systemPrompts[persona as keyof typeof systemPrompts] || systemPrompts.nuva;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
