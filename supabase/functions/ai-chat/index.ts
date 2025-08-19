
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
    const { message, therapistData, assistantData, attachments, conversationHistory = [] } = await req.json();

    console.log('Received request:', { message, therapistData: therapistData?.name, assistantData: assistantData?.name, attachments, historyLength: conversationHistory.length });

    // Handle initial greeting request
    const isInitialGreeting = message === '__INITIAL_GREETING__';

    // Create system prompt from assistant or therapist data
    let systemPrompt = "";
    
    // Handle assistant data (new format)
    if (assistantData?.system_prompt) {
      systemPrompt = assistantData.system_prompt;
    }
    // Handle therapist data (existing format for backwards compatibility)
    else if (therapistData?.background_story) {
      systemPrompt = therapistData.background_story;
    } else {
      systemPrompt = "You are a compassionate therapist and emotional support companion.";
    }
    
    // Add universal guidelines
    systemPrompt += " If users send images or videos, you will observe carefully and give warm responses. Please respond in the same language the user uses. Be supportive, understanding, and never judgmental.";

    // Build message array
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

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
      const userContent = isInitialGreeting 
        ? "Please provide your initial greeting to start the conversation."
        : message;
      messages.push({ role: 'user', content: userContent });
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
