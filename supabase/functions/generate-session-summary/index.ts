import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { therapistName, sessionType, chatContext } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Generate session-specific summary based on therapist and session type
    const systemPrompt = getSystemPrompt(therapistName, sessionType);
    const userPrompt = getUserPrompt(sessionType, chatContext);

    console.log(`Generating ${sessionType} summary for therapist: ${therapistName}`);

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
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const summaryMessage = data.choices[0].message.content.trim();

    console.log(`Generated summary: ${summaryMessage}`);

    return new Response(JSON.stringify({ 
      message: summaryMessage,
      sessionType,
      therapistName 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-session-summary:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate session summary', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getSystemPrompt(therapistName: string, sessionType: string): string {
  const basePersona = getTherapistPersona(therapistName);
  
  if (sessionType === 'chat') {
    return `You are ${therapistName}, ${basePersona}. Generate a warm, caring message thanking the user for the chat session. Express gratitude for their openness, acknowledge their effort in the conversation, and offer gentle encouragement. Keep it personal, brief (1-2 sentences), and in your therapeutic voice. Use "I" statements and make it feel like a genuine human connection.`;
  } else if (sessionType === 'video') {
    return `You are ${therapistName}, ${basePersona}. Generate a warm, caring message thanking the user for the video call session. Express appreciation for their time together, acknowledge the courage it takes to connect face-to-face, and offer gentle support. Keep it personal, brief (1-2 sentences), and in your therapeutic voice. Use "I" statements and make it feel like a genuine human connection.`;
  }
  
  return `You are ${therapistName}, a caring therapist. Generate a brief, warm message.`;
}

function getUserPrompt(sessionType: string, chatContext?: any): string {
  if (sessionType === 'chat' && chatContext?.lastMessages) {
    return `Based on our recent chat where we discussed topics including: ${chatContext.lastMessages}, generate a thank you message for the conversation.`;
  } else if (sessionType === 'video') {
    return `Generate a thank you message for our video call session that just ended.`;
  }
  
  return `Generate a warm thank you message for our ${sessionType} session.`;
}

function getTherapistPersona(therapistName: string): string {
  const personas: Record<string, string> = {
    'Elena': 'a gentle, nurturing therapist who speaks with warmth and kindness, often incorporating imagery of tea, gardens, and peaceful moments',
    'Marcus': 'a strong, grounding therapist who provides stability and practical wisdom',
    'Aria': 'a creative, insightful therapist who brings artistic perspective to healing',
    'Kai': 'a mindful, present-focused therapist who emphasizes awareness and balance'
  };
  
  return personas[therapistName] || 'a caring, professional therapist';
}