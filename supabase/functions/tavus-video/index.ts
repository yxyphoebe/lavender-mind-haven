
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
    const tavusApiKey = Deno.env.get('TAVUS_API_KEY');
    const tavusReplicaId = Deno.env.get('TAVUS_REPLICA_ID');
    const tavusPersonaId = Deno.env.get('TAVUS_PERSONA_ID');

    if (!tavusApiKey) {
      throw new Error('TAVUS_API_KEY not configured');
    }

    if (!tavusReplicaId) {
      throw new Error('TAVUS_REPLICA_ID not configured');
    }

    if (!tavusPersonaId) {
      throw new Error('TAVUS_PERSONA_ID not configured');
    }

    if (action === 'create') {
      console.log('Creating Tavus conversation for therapist:', therapistName);
      
      const response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          'x-api-key': tavusApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus API error:', response.status, errorText);
        throw new Error(`Failed to create conversation: ${response.status}`);
      }

      const data = await response.json();
      console.log('Tavus conversation created:', data.conversation_id);
      
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
      
      const response = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': tavusApiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to end conversation:', response.status, errorText);
        throw new Error(`Failed to end conversation: ${response.status}`);
      }

      console.log('Tavus conversation ended successfully');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Conversation ended successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action specified');

  } catch (error) {
    console.error('Error in tavus-video function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
