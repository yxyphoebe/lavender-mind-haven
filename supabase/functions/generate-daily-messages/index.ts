import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { therapistId } = await req.json()

    if (!therapistId) {
      return new Response(
        JSON.stringify({ error: 'therapistId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Generating daily messages for user:', user.id, 'therapist:', therapistId)

    // Check if user already has enough unused messages
    const { data: existingMessages, error: checkError } = await supabaseClient
      .from('daily_messages')
      .select('id')
      .eq('user_id', user.id)
      .eq('therapist_id', therapistId)
      .eq('is_used', false)

    if (checkError) {
      console.error('Error checking existing messages:', checkError)
      return new Response(
        JSON.stringify({ error: 'Failed to check existing messages' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (existingMessages && existingMessages.length >= 3) {
      console.log('User already has enough unused messages:', existingMessages.length)
      return new Response(
        JSON.stringify({ message: 'User already has enough unused messages', count: existingMessages.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the prompt for this therapist
    const { data: prompts, error: promptError } = await supabaseClient
      .from('generation_prompts')
      .select('prompt_text, therapist_name')
      .eq('therapist_id', therapistId)
      .eq('prompt_type', 'text')
      .eq('active', true)
      .limit(1)

    if (promptError || !prompts || prompts.length === 0) {
      console.error('Error fetching prompt:', promptError)
      return new Response(
        JSON.stringify({ error: 'No active prompt found for this therapist' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const prompt = prompts[0]
    console.log('Using prompt for therapist:', prompt.therapist_name)

    // Call OpenAI to generate 5 daily messages
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Generate exactly 5 different daily supportive messages. ${prompt.prompt_text}. Return the response as a JSON array of strings, like: ["message1", "message2", "message3", "message4", "message5"]`
          },
          {
            role: 'user',
            content: 'Generate 5 daily supportive messages'
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    })

    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', openAIResponse.statusText)
      return new Response(
        JSON.stringify({ error: 'Failed to generate messages' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const openAIData = await openAIResponse.json()
    const generatedContent = openAIData.choices[0].message.content

    console.log('Generated content:', generatedContent)

    // Parse the generated messages
    let messages: string[]
    try {
      messages = JSON.parse(generatedContent)
      if (!Array.isArray(messages) || messages.length !== 5) {
        throw new Error('Invalid format')
      }
    } catch (parseError) {
      console.error('Error parsing generated messages:', parseError)
      // Fallback: split by lines and take first 5
      messages = generatedContent.split('\n').filter((line: string) => line.trim()).slice(0, 5)
    }

    // Get user info for the messages
    const { data: userData, error: userDataError } = await supabaseClient
      .from('users')
      .select('name, preferred_language')
      .eq('id', user.id)
      .single()

    if (userDataError) {
      console.error('Error fetching user data:', userDataError)
    }

    // Insert the messages into the database
    const messagesToInsert = messages.map(messageText => ({
      user_id: user.id,
      user_name: userData?.name || 'User',
      therapist_id: therapistId,
      therapist_name: prompt.therapist_name,
      message_text: messageText,
      message_type: 'daily_support',
      language: userData?.preferred_language || 'en',
      is_used: false
    }))

    const { error: insertError } = await supabaseClient
      .from('daily_messages')
      .insert(messagesToInsert)

    if (insertError) {
      console.error('Error inserting messages:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to save messages' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully generated and saved', messages.length, 'daily messages')

    return new Response(
      JSON.stringify({ 
        success: true, 
        generated: messages.length,
        messages: messagesToInsert
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-daily-messages function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})