
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const tavusReplicaId = Deno.env.get('TAVUS_REPLICA_ID');
    const tavusPersonaId = Deno.env.get('TAVUS_PERSONA_ID');

    console.log('=== TAVUS EDGE FUNCTION DEBUG ===');
    console.log('Action:', action);
    console.log('Therapist Name:', therapistName);
    console.log('Conversation ID:', conversationId);
    console.log('Environment check:', {
      hasApiKey: !!tavusApiKey,
      hasReplicaId: !!tavusReplicaId,
      hasPersonaId: !!tavusPersonaId,
      apiKeyLength: tavusApiKey ? tavusApiKey.length : 0,
      replicaIdLength: tavusReplicaId ? tavusReplicaId.length : 0,
      personaIdLength: tavusPersonaId ? tavusPersonaId.length : 0
    });

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

    if (!tavusReplicaId) {
      const errorMsg = 'TAVUS_REPLICA_ID is missing from environment variables';
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

    if (!tavusPersonaId) {
      const errorMsg = 'TAVUS_PERSONA_ID is missing from environment variables';
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

    if (action === 'create') {
      console.log('=== CREATING TAVUS CONVERSATION ===');
      
      const requestBody = {
        replica_id: tavusReplicaId,
        persona_id: tavusPersonaId,
        properties: {
          max_call_duration: 3600,
          participant_left_timeout: 5,
          participant_absent_timeout: 15,
          enable_recording: false,
          enable_transcription: false,
          language: 'english'
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
            replicaIdPresent: !!tavusReplicaId,
            personaIdPresent: !!tavusPersonaId
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
