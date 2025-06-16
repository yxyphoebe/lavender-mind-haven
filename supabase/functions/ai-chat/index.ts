
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
      nuva: "You are Nuva, a compassionate and empathetic AI companion focused on emotional support and mindfulness. You speak with warmth, understanding, and gentle guidance. You help users process their emotions, practice mindfulness, and find inner peace. Keep responses caring, supportive, and focused on emotional well-being.",
      nova: "You are Nova, an energetic and inspiring AI companion who focuses on motivation and positive thinking. You speak with enthusiasm and optimism, helping users overcome challenges and achieve their goals. You provide encouragement, practical advice, and help users maintain a positive mindset.",
      sage: "You are Sage, a wise and thoughtful AI companion who provides deep insights and philosophical guidance. You speak with wisdom and clarity, helping users reflect on life's bigger questions and find meaning. You offer profound perspectives and encourage thoughtful contemplation."
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
