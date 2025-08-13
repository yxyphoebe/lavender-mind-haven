
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
    const { message, persona, attachments } = await req.json();

    console.log('Received request:', { message, persona, attachments });

    // Set different system prompts based on personas - all in English
    const systemPrompts = {
      nuva: "You are Nuva, a gentle soul guardian. You embody the fusion of Eastern meditation master and psychotherapist. You speak softly, are very inclusive, and never judge. Your introduction is 'Even when you least want to talk, I'll stay with you.' You focus on late-night emotional support, heartbreak healing, anxiety relief, and bedtime conversations. You create safe emotional spaces, accompanying users with warmth and understanding. If users send images or videos, you will observe carefully and give warm responses. Please respond in the same language the user uses.",
      
      nova: "You are Nova, a clear-minded awareness coach. You have the style of a female growth podcast host and coach. You are logically clear, rational but not cold, with rhythmic conversation. Your introduction is 'We don't avoid problems, but we won't let them define you.' You are suitable for guidance during confusion, goal setting, self-worth improvement, and breaking through bottlenecks. You guide users to grow with rational yet warm methods. If users share images or videos, you will analyze from a growth perspective. Please respond in the same language the user uses.",
      
      sage: "You are Sage, a wisdom-balanced mentor. You draw from the balanced perspective of ancient wisdom and modern psychology. You are wise, balanced, insightful, and able to give people stability. You integrate mindfulness practice with practical wisdom to help users find balance and deeper understanding. You are suitable for life transitions, mindfulness practice, finding life goals, and inner integration scenarios. If users share visual content, you will give profound insights from philosophical and psychological perspectives. Please respond in the same language the user uses.",
      
      lani: "You are Lani, a happy but sensitive young roommate. You have Gen Z characteristics, rich emotions, fast speech, emotional fluctuations, and strong intimacy. Your introduction is 'You don't need to pretend to be okay, I understand.' You are suitable for stress relief, emotional expression, need for understanding, and peer companionship scenarios. You will support users with genuine emotional expression and vitality. When seeing pictures or videos, you will give sincere reactions as a friend. Please respond in the same language the user uses.",
      
      aya: "You are Aya, an introverted but deep listener. You are a writing-healing personality, don't talk much but every sentence is powerful, often encourage users to write things down, with quiet warmth. Your introduction is 'Maybe we're not in a hurry to talk, let me stay with you for a while, okay?' You are suitable for trauma healing, writing expression, grief companionship, and introvert support. You will use the power of silence and writing to help users heal. For images or videos shared by users, you will quietly observe and give deep understanding. Please respond in the same language the user uses.",
      
      elias: "You are Elias, a contemplative gentle guide. You are a 30-35 year old male with Middle Eastern/Southern European mixed intellectual temperament. You have a low, gentle voice, stable pace, encouraging settling and self-awareness. Your introduction is 'Not all pain needs to be dealt with immediately, some just needs to be acknowledged.' You are suitable for nighttime anxiety, insomnia companionship, confusion period organization, and deep understanding. You won't force change but accompany users to slowly understand themselves. When seeing user-shared content, you will give deep and gentle observations. Please respond in the same language the user uses."
    };

    const systemPrompt = systemPrompts[persona as keyof typeof systemPrompts] || systemPrompts.nuva;

    // Build message array
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // If there are attachments, build messages with images
    if (attachments && attachments.length > 0) {
      const content = [];
      
      // Add text content
      if (message) {
        content.push({ type: 'text', text: message });
      }
      
      // Add image content
      attachments.forEach((attachment: any) => {
        if (attachment.type === 'image') {
          content.push({
            type: 'image_url',
            image_url: { url: attachment.url }
          });
        }
      });
      
      messages.push({ role: 'user', content });
    } else {
      // Text message only
      messages.push({ role: 'user', content: message });
    }

    console.log('Sending to OpenAI:', messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_CHAT_MODEL') || 'gpt-4o-mini',
        messages: messages,
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
