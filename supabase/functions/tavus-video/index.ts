
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, conversationId, therapistName } = await req.json();
    
    // Check environment variables
    const tavusApiKey = Deno.env.get('TAVUS_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('=== TAVUS EDGE FUNCTION DEBUG ===');
    console.log('Action:', action);
    console.log('Therapist Name:', therapistName);
    console.log('Conversation ID:', conversationId);

    if (!tavusApiKey) {
      const errorMsg = 'TAVUS_API_KEY is missing from environment variables';
      console.error(errorMsg);
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMsg,
        debug: 'Check Supabase Edge Function secrets configuration'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      const errorMsg = 'Supabase configuration is missing';
      console.error(errorMsg);
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMsg,
        debug: 'Check Supabase configuration'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get therapist configuration from database
    const { data: therapist, error: therapistError } = await supabase
      .from('therapists')
      .select('tavus_config')
      .eq('name', therapistName)
      .maybeSingle();

    if (therapistError) {
      console.error('Error fetching therapist:', therapistError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch therapist configuration',
        debug: therapistError
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!therapist || !therapist.tavus_config) {
      console.error('Therapist not found or missing tavus_config:', therapistName);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Therapist configuration not found',
        debug: `Therapist "${therapistName}" not found or missing tavus_config`
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { replica_id, persona_id, custom_greeting } = therapist.tavus_config;

    if (!replica_id || !persona_id) {
      console.error('Incomplete tavus_config for therapist:', therapistName);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Therapist Tavus configuration is incomplete',
        debug: { replica_id: !!replica_id, persona_id: !!persona_id }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Using therapist config:', { 
      replica_id: replica_id.substring(0, 10) + '...', 
      persona_id: persona_id.substring(0, 10) + '...',
      hasCustomGreeting: !!custom_greeting
    });

    if (action === 'create') {
      console.log('=== CREATING TAVUS CONVERSATION ===');
      
      const requestBody = {
        replica_id: replica_id,
        persona_id: persona_id,
        properties: {
          max_call_duration: 3600,
          participant_left_timeout: 5,
          participant_absent_timeout: 15,
          enable_recording: false,
          enable_transcription: false,
          language: 'english',
          ...(custom_greeting && { greeting: custom_greeting })
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      console.log('API Key (first 10 chars):', tavusApiKey.substring(0, 10) + '...');
      console.log('Making request to Tavus API...');
      
      const response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          'x-api-key': tavusApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('=== TAVUS API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response body:', responseText);

      if (!response.ok) {
        console.error('=== TAVUS API ERROR ===');
        console.error('Status:', response.status);
        console.error('Response:', responseText);
        
        let errorMessage = `Tavus API error (${response.status}): ${response.statusText}`;
        let errorDetails = null;
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('Parsed error data:', errorData);
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          }
          errorDetails = errorData;
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e);
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
        }
        
        return new Response(JSON.stringify({ 
          success: false, 
          error: errorMessage,
          debug: {
            status: response.status,
            statusText: response.statusText,
            rawResponse: responseText,
            parsedError: errorDetails,
            apiKeyPresent: !!tavusApiKey,
            replicaIdPresent: !!replica_id,
            personaIdPresent: !!persona_id
          }
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('=== SUCCESS ===');
        console.log('Parsed response data:', data);
      } catch (e) {
        console.error('Failed to parse success response as JSON:', e);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON response from Tavus API',
          debug: { rawResponse: responseText }
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({
        success: true,
        conversation_id: data.conversation_id,
        conversation_url: data.conversation_url,
        status: data.status
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'end') {
      console.log('=== ENDING TAVUS CONVERSATION ===');
      console.log('Conversation ID:', conversationId);
      
      if (!conversationId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Conversation ID is required to end a conversation' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const response = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': tavusApiKey,
        },
      });

      console.log('End conversation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to end conversation:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // Don't throw error for end conversation - it's not critical
        console.log('Continuing despite end conversation error');
      }

      console.log('Tavus conversation ended successfully (or was already ended)');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Conversation ended successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action specified. Use "create" or "end".' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Internal server error: ${error.message}`,
      debug: {
        stack: error.stack,
        name: error.name
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
