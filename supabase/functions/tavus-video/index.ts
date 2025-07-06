
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

    console.log('Environment check:', {
      hasApiKey: !!tavusApiKey,
      hasReplicaId: !!tavusReplicaId,
      hasPersonaId: !!tavusPersonaId,
      action,
      therapistName
    });

    if (!tavusApiKey) {
      console.error('TAVUS_API_KEY is missing');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'TAVUS_API_KEY not configured. Please set up your Tavus API key in the Edge Function secrets.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!tavusReplicaId) {
      console.error('TAVUS_REPLICA_ID is missing');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'TAVUS_REPLICA_ID not configured. Please set up your Tavus Replica ID in the Edge Function secrets.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!tavusPersonaId) {
      console.error('TAVUS_PERSONA_ID is missing');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'TAVUS_PERSONA_ID not configured. Please set up your Tavus Persona ID in the Edge Function secrets.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create') {
      console.log('Creating Tavus conversation for therapist:', therapistName);
      
      const requestBody = {
        replica_id: tavusReplicaId,
        persona_id: tavusPersonaId,
        properties: {
          // Optimized for low latency
          max_call_duration: 3600,
          participant_left_timeout: 5, // Reduced from 10
          participant_absent_timeout: 15, // Reduced from 30
          enable_recording: false,
          enable_transcription: false,
          language: 'english',
          // Low latency audio settings
          audio_settings: {
            bitrate: 'high', // Higher bitrate for better quality/speed tradeoff
            sample_rate: 48000, // Optimal sample rate
            channels: 1, // Mono for lower latency
            codec: 'opus' // Opus codec for low latency
          },
          // Video optimization
          video_settings: {
            resolution: '720p', // Balance between quality and latency
            framerate: 30,
            bitrate: 'adaptive' // Adaptive bitrate for network conditions
          },
          // Network optimization
          connection_settings: {
            ice_transport_policy: 'all',
            bundle_policy: 'max-bundle',
            rtcp_mux_policy: 'require'
          }
        }
      };

      console.log('Sending request to Tavus API with body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          'x-api-key': tavusApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Tavus API response status:', response.status);
      console.log('Tavus API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorMessage = `Failed to create conversation: ${response.status}`;
        
        // Try to parse error details if possible
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (e) {
          errorMessage += ` - ${errorText}`;
        }
        
        return new Response(JSON.stringify({ 
          success: false, 
          error: errorMessage,
          details: {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          }
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      console.log('Tavus conversation created successfully:', data);
      
      return new Response(JSON.stringify({
        success: true,
        conversation_id: data.conversation_id,
        conversation_url: data.conversation_url,
        status: data.status
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'end') {
      console.log('Ending Tavus conversation:', conversationId);
      
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
    console.error('Error in tavus-video function:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Internal server error: ${error.message}`,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
