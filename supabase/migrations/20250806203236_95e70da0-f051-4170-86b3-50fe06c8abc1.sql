-- Update Sage therapist with tavus configuration
UPDATE public.therapists 
SET tavus_config = '{
  "persona_id": "p50bd43dc74b",
  "replica_id": "r2930834dac1", 
  "custom_greeting": "Hey… I'm really glad to see you today. Let's take a breath together, just for a moment. How are you feeling right now?"
}'::JSONB
WHERE name = 'Sage';